#!/bin/bash


export COREPACK_ENABLE_DOWNLOAD_PROMPT=0

echo "🚀 Iniciando aplicação Budokan Backend..."

# Função para aguardar o banco de dados
wait_for_database() {
    echo "⏳ Aguardando o banco de dados estar pronto..."
    while ! nc -z mysql 3306; do
        echo "   Banco ainda não está pronto, aguardando..."
        sleep 2
    done
    echo "✅ Banco de dados está pronto!"
}

# Função para executar o drizzle-kit push
run_drizzle_push() {
    echo "🔄 Executando drizzle-kit push..."
    max_attempts=5
    attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        echo "   Tentativa $attempt de $max_attempts..."
        if pnpm drizzle-kit push -y; then
            echo "✅ Drizzle push executado com sucesso!"
            return 0
        else
            echo "❌ Falha na tentativa $attempt"
            if [ $attempt -lt $max_attempts ]; then
                echo "   Aguardando 5 segundos antes da próxima tentativa..."
                sleep 5
            fi
            attempt=$((attempt + 1))
        fi
    done
    
    echo "❌ Falha ao executar drizzle-kit push após $max_attempts tentativas"
    return 1
}

# Executar as funções
wait_for_database
if run_drizzle_push; then
    echo "🚀 Iniciando a aplicação..."
    exec tsx src/index.ts
else
    echo "❌ Erro ao executar drizzle-kit push. Saindo..."
    exit 1
fi 