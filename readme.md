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
git clone https://github.com/Projeto-Ifal-Budokan/budokan-be.git
cd budokan-be
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

O projeto utiliza Drizzle ORM para gerenciamento do banco de dados. O esquema do banco está localizado em `src/db/schema/*.ts`.

### Docker

Para subir o container do banco:

```bash
docker compose up -d
```

Para verificar os containeres rodando:
```bash
docker ps
```

Para derrubar o container:
```bash
docker compose down
```

Para derrubar o container e limpar o banco:
```bash
docker compose down -v
```

### Migrações do Banco de Dados

Para aplicar suas alterações novas no banco (Gerar e aplicar migrations automaticamente):
```bash
pnpm drizzle-kit push
```

Para apenas gerar migrations:
```bash
pnpm drizzle-kit generate
```

Para apenas aplicar migrations:
```bash
pnpm drizzle-kit migrate
```

### Drizzle Studio para visualização e manipulação rápida do banco

```bash
pnpm drizzle-kit studio
```

### Diagrama do banco: Gerando e visualizando o diagrama do schema do Drizzle

Por enquanto, para gerar o diagrama do schema do banco é necessário ter o schema inteiro do banco em um único arquivo. Estamos usando o arquivo `./src/db/unifiedSchema.ts`.

Você precisará atualizar este schema unificado manualmente com o código mais recente do schema de cada entidade.

Para gerar o arquivo .dbml contendo o diagrama do schema do banco, basta rodar:

```bash
pnpm dbml
```
O arquivo `unified-schema.dbml` será gerado ou atualizado na raíz do projeto.

Para visualizar o arquivo em formato de diagrama, instale a seguinte extensão no seu VSCode: https://marketplace.visualstudio.com/items?itemName=bocovo.dbml-erd-visualizer

Ou utilize qualquer outro visualizador de arquivos `.dbml` de sua preferência

## 🏃‍♂️ Executando a Aplicação

Modo de desenvolvimento:
```bash
pnpm dev
```

### Seeds

O projeto possui um seed para criar um usuário admin já com status ativo para logar no sistema:
```bash
pnpm seed
```

eis os dados do usuário para login:
```json
{
  "email": "admin@budokan.com",
  "password": "admin123"
}
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
