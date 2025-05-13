# Use a imagem oficial do Node.js
FROM node:20-slim AS base

# Configuração do pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# Garantindo instalação não interativa
RUN corepack enable && \
    corepack prepare pnpm@9.15.4 --activate && \
    pnpm --version

# Estágio para instalar as dependências de produção
FROM base AS prod-deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# Estágio para instalar todas as dependências e construir o projeto
FROM base AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .
# Se você tiver um script de build, descomente a próxima linha
# RUN pnpm run build

# Estágio final
FROM base
WORKDIR /app

# Garantir que o tsx esteja disponível globalmente
RUN npm install -g tsx

# Copiar das etapas anteriores
COPY --from=prod-deps /app/node_modules /app/node_modules
# Se você tiver um diretório de build, descomente a próxima linha
# COPY --from=build /app/dist /app/dist
COPY . .

# Expõe a porta que a aplicação usa
EXPOSE 8000

# Comando para iniciar a aplicação - usando tsx diretamente
CMD ["tsx", "src/index.ts"] 