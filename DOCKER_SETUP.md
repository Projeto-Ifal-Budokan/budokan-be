# Configuração Docker com Drizzle Kit Push Automático

Esta configuração garante que o `pnpm drizzle-kit push` seja executado automaticamente quando o container da aplicação iniciar, após o banco de dados MySQL estar pronto.

## Como Funciona

1. **Healthcheck do MySQL**: O container MySQL possui um healthcheck que verifica se o banco está funcionando
2. **Dependência com Healthcheck**: O container da aplicação só inicia após o MySQL estar saudável
3. **Script de Inicialização**: O `start.sh` aguarda o banco estar pronto e executa o drizzle-kit push
4. **Retry Logic**: Se o drizzle-kit push falhar, ele tenta novamente até 5 vezes

## Arquivos Modificados

- `Dockerfile`: Adicionado script de inicialização e netcat para verificar conectividade
- `docker-compose.yml`: Adicionado healthcheck para MySQL e dependência com condição
- `start.sh`: Script de inicialização que executa o drizzle-kit push

## Como Usar

### Desenvolvimento
```bash
# Construir e iniciar os containers
docker-compose up --build

# Ou em background
docker-compose up -d --build
```

### Logs
```bash
# Ver logs da aplicação
docker-compose logs -f app

# Ver logs do MySQL
docker-compose logs -f mysql
```

### Parar os containers
```bash
docker-compose down
```

## Fluxo de Inicialização

1. Container MySQL inicia
2. Healthcheck aguarda MySQL estar pronto
3. Container da aplicação inicia
4. Script `start.sh` executa:
   - Aguarda conectividade com MySQL
   - Executa `pnpm drizzle-kit push`
   - Inicia a aplicação com `tsx src/index.ts`

## Troubleshooting

### Se o drizzle-kit push falhar
- Verifique se o schema está correto em `src/db/schema/`
- Verifique se as variáveis de ambiente estão configuradas
- Verifique os logs: `docker-compose logs app`

### Se o banco não conectar
- Verifique se o MySQL está rodando: `docker-compose ps`
- Verifique os logs do MySQL: `docker-compose logs mysql`
- Verifique se as credenciais estão corretas no `docker-compose.yml`

## Variáveis de Ambiente

Certifique-se de que a `DATABASE_URL` está configurada corretamente:
```
DATABASE_URL=mysql://budokan:budokan@mysql:3306/budokan-db
```

## Notas

- O script aguarda até 5 tentativas para o drizzle-kit push
- O healthcheck do MySQL verifica a cada 10 segundos
- O container da aplicação só inicia após o MySQL estar saudável 