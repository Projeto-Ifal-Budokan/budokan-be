#!/bin/bash
#
# Deploy do backend Budokan nesta máquina.
#
# Tudo passa pelo gateway /usr/local/bin/budokan-docker — o usuário de deploy não
# tem acesso ao socket e o gateway recusa qualquer alvo que não seja do Budokan.
#
set -euo pipefail

GW="sudo -n /usr/local/bin/budokan-docker"
APP_CONTAINER=budokan-be-app
DB_CONTAINER=budokan-be-mysql

echo "=== DEPLOY BE STARTED at $(date) ==="

if [[ ! -f .env ]]; then
	echo "❌ Falta .env. Copie a partir de .env.example."
	exit 1
fi

falta=()
for k in DATABASE_URL JWT_SECRET MYSQL_ROOT_PASSWORD MYSQL_DATABASE MYSQL_USER MYSQL_PASSWORD; do
	grep -qE "^${k}=..*" .env || falta+=("$k")
done
if ((${#falta[@]})); then
	echo "❌ .env sem valor para: ${falta[*]}"
	exit 1
fi

# O container roda `drizzle-kit push` no start (start.sh). Sem backup do banco,
# isso é arriscado em produção — excluir a confirmação é decisão do dono.
if [[ -t 0 && "${BUDOKAN_ASSUME_YES:-}" != "1" ]]; then
	read -rp "⚠️  O start.sh vai rodar drizzle-kit push no banco. Continuar? [y/N] " ok
	[[ $ok == y || $ok == Y ]] || {
		echo "cancelado"
		exit 1
	}
fi

echo "🔄 Atualizando código..."
git reset --hard
git pull origin main

echo "🐳 Subindo..."
$GW compose be up -d --build

echo "🩺 Aguardando o banco..."
for _ in $(seq 1 40); do
	if $GW inspect "$DB_CONTAINER" 2>/dev/null | grep -q '"Status": "healthy"'; then
		echo "✅ MySQL healthy"
		break
	fi
	sleep 3
done

echo "🩺 Saúde do app..."
$GW inspect "$APP_CONTAINER" 2>/dev/null |
	python3 -c "
import json, sys
for c in json.load(sys.stdin):
    st = c.get('State', {})
    print('  ', c.get('Name'), '| status:', st.get('Status'),
          '| health:', (st.get('Health') or {}).get('Status', 'sem healthcheck'),
          '| restarts:', st.get('RestartCount'))
" || echo "  (container ainda não visível)"

echo "📋 Log recente:"
$GW logs "$APP_CONTAINER" || true

$GW compose be ps
echo "=== DEPLOY BE FINISHED at $(date) ==="
