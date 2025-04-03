# Portal Budokan Backend

Serviço backend para o Portal Budokan construído com Express.js, TypeScript e Drizzle ORM.

## 🚀 Tecnologias

- **Node.js** - Ambiente de execução
- **Express.js** - Framework web
- **TypeScript** - Linguagem de programação
- **Drizzle ORM** - ORM para banco de dados
- **MySQL** - Banco de dados
- **pnpm** - Gerenciador de pacotes

## 📋 Pré-requisitos

- Node.js (versão LTS recomendada)
- pnpm
- Banco de dados MySQL

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone https://github.com/yourusername/portal-budokan-be.git
cd portal-budokan-be
```

2. Instale as dependências:
```bash
pnpm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```
Em seguida, edite o arquivo `.env` com suas credenciais do banco de dados.

## ⚙️ Configuração

O projeto utiliza Drizzle ORM para gerenciamento do banco de dados. O esquema do banco está localizado em `src/db/schema.ts`.

### Migrações do Banco de Dados

Para aplicar alterações no banco (Gerar e aplicar migrations automaticamente):
```bash
npx drizzle-kit push
```

Para gerar migrações:
```bash
npx drizzle-kit generate
```

Para aplicar migrações:
```bash
npx drizzle-kit migrate
```

## 🏃‍♂️ Executando a Aplicação

Modo de desenvolvimento:
```bash
pnpm dev
```

## 📁 Estrutura do Projeto

```
portal-budokan-be/
├── src/              # Código fonte
├── drizzle/          # Migrações do banco de dados
├── drizzle.config.ts # Configuração do Drizzle
└── tsconfig.json    # Configuração do TypeScript
```

## 📄 Licença

ISC

## 🤝 Como Contribuir

1. Faça um Fork do projeto
2. Crie uma Branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Faça Push para a Branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request
