# Use a imagem oficial do Node.js
FROM node:20-slim AS base

# Configuração do pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# Garantindo instalação não interativa
RUN corepack enable && \
    corepack prepare pnpm@9.15.4 --activate && \
    pnpm --version

# Estágio para instalar todas as dependências
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Estágio final
FROM base
WORKDIR /app

# Garantir que o tsx esteja disponível globalmente
RUN npm install -g tsx

# Instalar netcat para verificar conectividade com o banco
RUN apt-get update && apt-get install -y netcat-openbsd dos2unix && rm -rf /var/lib/apt/lists/*

# Copiar todas as dependências (incluindo devDependencies para drizzle-kit)
COPY --from=deps /app/node_modules /app/node_modules

# Copiar todos os arquivos
COPY . .

# Garantir que o start.sh está correto e executável
RUN dos2unix /app/start.sh 2>/dev/null || true && \
    chmod +x /app/start.sh && \
    ls -la /app/start.sh && \
    cat /app/start.sh | head -1

# Expõe a porta que a aplicação usa
EXPOSE 8000

# Comando para iniciar a aplicação com o script de inicialização
CMD ["/bin/bash", "/app/start.sh"] 