# Configuração do Cloudflare para CDN de Imagens

## Pré-requisitos
- Conta no Cloudflare (gratuita)
- Domínio configurado (ex: budokanryu.com.br)
- Servidor com IP público

## Passo a Passo

### 1. Criar conta no Cloudflare
1. Acesse [cloudflare.com](https://cloudflare.com)
2. Clique em "Sign Up" e crie uma conta gratuita
3. Faça login no dashboard

### 2. Adicionar seu domínio
1. No dashboard, clique em "Add a Site"
2. Digite seu domínio: `budokanryu.com.br`
3. Escolha o plano "Free"
4. Clique em "Continue"

### 3. Configurar DNS
1. Cloudflare detectará automaticamente seus registros DNS
2. **Importante**: Configure o registro A do seu domínio para apontar para o IP do seu servidor
3. Exemplo:
   ```
   Type: A
   Name: @
   Content: 123.456.789.10 (IP do seu servidor)
   Proxy status: Proxied (laranja)
   ```

### 4. Configurar SSL/TLS
1. Vá em "SSL/TLS" no menu lateral
2. Configure como "Full" ou "Full (strict)" se tiver certificado SSL no servidor
3. Para desenvolvimento, "Flexible" funciona bem

### 5. Configurar Cache
1. Vá em "Caching" → "Configuration"
2. Configure "Browser Cache TTL" para "4 hours"
3. Em "Edge Cache TTL", configure para "4 hours"

### 6. Configurar Page Rules (Opcional)
1. Vá em "Page Rules"
2. Clique em "Create Page Rule"
3. Configure:
   - URL: `budokanryu.com.br/uploads/*`
   - Settings:
     - Cache Level: Cache Everything
     - Edge Cache TTL: 1 day
     - Browser Cache TTL: 1 day

### 7. Configurar Variáveis de Ambiente

Adicione ao seu arquivo `.env`:

```env
# Cloudflare Configuration
CLOUDFLARE_DOMAIN=budokanryu.com.br
NODE_ENV=production
```

### 8. Testar a Configuração

1. Faça upload de uma imagem de perfil
2. Verifique se a URL retornada usa o domínio do Cloudflare
3. Teste o acesso à imagem via CDN

## Benefícios da Configuração

- ✅ **Performance**: Imagens servidas de servidores próximos ao usuário
- ✅ **Segurança**: SSL/TLS gratuito e proteção DDoS
- ✅ **Cache**: Reduz carga no seu servidor
- ✅ **Escalabilidade**: Suporta tráfego alto sem custo adicional
- ✅ **Analytics**: Métricas de uso das imagens

## Troubleshooting

### Problema: Imagens não carregam
- Verifique se o registro DNS está configurado corretamente
- Confirme se o proxy está ativo (ícone laranja)
- Teste se o servidor está acessível diretamente

### Problema: Cache não funciona
- Verifique as configurações de Page Rules
- Confirme os headers de cache
- Aguarde alguns minutos para propagação

### Problema: SSL não funciona
- Configure SSL/TLS como "Flexible" para desenvolvimento
- Use "Full" ou "Full (strict)" para produção com certificado

## Monitoramento

- Use o dashboard do Cloudflare para monitorar:
  - Tráfego de imagens
  - Performance do cache
  - Uso de largura de banda
  - Ameaças bloqueadas

## Custos

- **Plano Free**: Inclui tudo que você precisa
- **Sem limite** de largura de banda
- **10GB** de armazenamento
- **200+** data centers globais 