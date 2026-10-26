# Configuração de Email - Budokan Backend

## Visão Geral

O sistema de email do Budokan suporta dois ambientes:

1. **Desenvolvimento**: Usa Ethereal Email (serviço de teste)
2. **Produção**: Usa Gmail SMTP

## Configuração para Desenvolvimento

### 1. Variáveis de Ambiente (Docker)

No `docker-compose.yml`, as variáveis já estão configuradas:

```yaml
environment:
  - NODE_ENV=develop
  - ETHEREAL_USER=frida20@ethereal.email
  - ETHEREAL_PASS=Debt5yAYKFeQDvDQR4
  - GMAIL_USER=budokanryu.suporte@gmail.com
  - GMAIL_APP_PASSWORD=sua-senha-de-app-16-caracteres
```

### 2. Como funciona

- Emails são enviados para o servidor de teste Ethereal
- Você pode visualizar os emails em: https://ethereal.email
- Use as credenciais acima para acessar

## Configuração para Produção

### 1. Configurar Gmail

#### Passo 1: Ativar Autenticação de 2 Fatores
1. Acesse sua conta Google
2. Vá em "Segurança"
3. Ative "Verificação em duas etapas"

#### Passo 2: Gerar Senha de App
1. Ainda em "Segurança"
2. Clique em "Senhas de app"
3. Selecione "Email" como aplicativo
4. Copie a senha gerada (16 caracteres)

### 2. Variáveis de Ambiente

Atualize as variáveis no `docker-compose.yml`:

```yaml
environment:
  - NODE_ENV=production
  - GMAIL_USER=seu-email@gmail.com
  - GMAIL_APP_PASSWORD=sua-senha-de-app-16-caracteres
```

### 3. Exemplo de Configuração Completa

```yaml
environment:
  - NODE_ENV=production
  - GMAIL_USER=budokanryu.suporte@gmail.com
  - GMAIL_APP_PASSWORD=abcd efgh ijkl mnop  # Senha de app do Gmail
  - PROD_URL=https://budokanryu.com.br
```

## Troubleshooting

### Problema: "Email enviado: false"

**Causa**: A função `nodemailer.getTestMessageUrl()` retorna `false` para emails reais.

**Solução**: ✅ **Já corrigido no código**
- Emails reais não retornam URL de teste
- O log agora mostra "Email enviado com sucesso para servidor real"

### Problema: Erro de Autenticação Gmail

**Possíveis causas**:
1. Senha de app incorreta
2. Autenticação de 2 fatores não ativada
3. Email ou senha incorretos

**Solução**:
1. Verifique se a autenticação de 2 fatores está ativa
2. Gere uma nova senha de app
3. Verifique se não há espaços extras nas variáveis

### Problema: Email não chega ao destinatário

**Verificações**:
1. Verifique a pasta de spam
2. Confirme se o email está na lista `accepted` do log
3. Verifique se não há erros no log

## Logs de Exemplo

### Email Enviado com Sucesso (Produção)
```
✅ Servidor de email pronto para enviar mensagens
📧 Ambiente: production
🔧 Configuração: Gmail (Produção)
📨 Email remetente: budokanryu.suporte@gmail.com

Email enviado: Email enviado com sucesso para servidor real
Detalhes do envio: {
  accepted: [ 'usuario@exemplo.com' ],
  rejected: [],
  response: '250 2.0.0 OK',
  messageId: '<id-único@gmail.com>'
}
```

### Email de Teste (Desenvolvimento)
```
✅ Servidor de email pronto para enviar mensagens
📧 Ambiente: develop
🔧 Configuração: Ethereal (Desenvolvimento)
📨 Email remetente: Ethereal (teste)

Email enviado: https://ethereal.email/message/...
Detalhes do envio: { ... }
```

## Testando a Configuração

### 1. Teste de Recuperação de Senha
```bash
curl -X POST http://localhost:8001/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "teste@exemplo.com"}'
```

### 2. Verificar Logs
```bash
docker logs budokan-be-app | grep -i email
```

## Segurança

### Boas Práticas
1. ✅ Nunca commite senhas no código
2. ✅ Use senhas de app do Gmail
3. ✅ Mantenha as variáveis de ambiente seguras
4. ✅ Use HTTPS em produção

### Variáveis Sensíveis
- `GMAIL_APP_PASSWORD`: Senha de app do Gmail
- `JWT_SECRET`: Chave secreta para JWT
- `DATABASE_URL`: URL do banco de dados

## Suporte

Se encontrar problemas:

1. Verifique os logs do container
2. Confirme as variáveis de ambiente
3. Teste com Ethereal primeiro
4. Verifique a documentação do Nodemailer 