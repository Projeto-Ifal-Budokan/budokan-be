# Portal Budokan Backend

Serviço backend para o Portal Budokan construído com Express.js, TypeScript e Drizzle ORM.

## 🚀 Tecnologias

- **Node.js** - Ambiente de execução
- **Express.js** - Framework web
- **TypeScript** - Linguagem de programação
- **Drizzle ORM** - ORM para banco de dados
- **MySQL** - Banco de dados
- **pnpm** - Gerenciador de pacotes
- **Docker** - Containerização

## 📋 Pré-requisitos

Para desenvolvimento local:
- Node.js (versão LTS recomendada)
- pnpm
- Banco de dados MySQL

Para execução com Docker:
- Docker
- Docker Compose

## 🛠️ Instalação

### Instalação Local

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

### Instalação com Docker

1. Clone o repositório:
```bash
git clone https://github.com/Projeto-Ifal-Budokan/budokan-be.git
cd budokan-be
```

2. Inicie os containers com Docker Compose:
```bash
docker-compose up -d
```

Isso irá configurar tanto o banco de dados MySQL quanto a aplicação em containers separados.

## ⚙️ Configuração

O projeto utiliza Drizzle ORM para gerenciamento do banco de dados. O esquema do banco está localizado em `src/db/schema/*.ts`.

### Docker

#### Executando somente o banco de dados:

Para subir apenas o container do banco:

```bash
docker-compose up -d mysql
```

#### Executando o projeto completo com Docker:

Para subir toda a aplicação (banco de dados e backend):

```bash
docker-compose up -d
```

Para visualizar os logs da aplicação:
```bash
docker-compose logs -f app
```

Para visualizar os logs do banco de dados:
```bash
docker-compose logs -f mysql
```

Para verificar os containeres rodando:
```bash
docker ps
```

Para derrubar os containers:
```bash
docker-compose down
```

Para derrubar os containers e remover as imagens:
```bash
docker-compose down --rmi all
```

Para derrubar os containers e limpar o banco:
```bash
docker-compose down -v
```

### Migrações do Banco de Dados

Se seu container do banco está recém criado e não possui nenhuma migration executada, ou você deseja aplicar suas alterações novas no banco (Gerar e aplicar migrations automaticamente):
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

### Localmente

Modo de desenvolvimento:
```bash
pnpm dev
```

A aplicação estará disponível em http://localhost:8000

### Com Docker

Para iniciar a aplicação em container:
```bash
docker-compose up -d
```

A aplicação estará disponível em http://localhost:3000

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
├── Dockerfile        # Configuração Docker da aplicação
├── docker-compose.yml # Configuração Docker Compose
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
