# NestJS Modular Boilerplate

API boilerplate com autenticação JWT, autorização por roles e organização modular inspirada em camadas (domínio, aplicação, infraestrutura). Adequado como ponto de partida; integrações extras (testes automatizados, cache, filas) ficam a cargo de quem adotar o template.

---

## Stack

| Tecnologia        | Versão (referência) |
| ----------------- | ------------------- |
| NestJS            | ^11                 |
| TypeORM           | ^0.3                |
| PostgreSQL        | 16 (imagem Docker) |
| Passport + JWT    | —                   |
| Bcrypt            | —                   |
| Class-validator   | —                   |
| Helmet            | ^8                  |
| Swagger (OpenAPI) | dev apenas          |

---

## Arquitetura

Cada módulo segue a separação em três camadas:

```
src/
└── modules/
    └── exemplo/
        ├── domain/          # Entidades, contratos de repositório
        ├── application/     # Casos de uso
        └── infrastructure/  # TypeORM, HTTP, guards, strategies
```

### Domain

Regras e modelos sem ORM nem framework.

### Application

Orquestra casos de uso usando apenas interfaces do domínio.

### Infrastructure

Implementações concretas: entidades ORM, repositórios, controllers, JWT, etc.

> **Não misture regra de negócio com detalhes de ORM** — mantenha as camadas isoladas.

---

## Autenticação e autorização

- JWT (Bearer)
- `@CurrentUser()` — usuário autenticado
- `@Roles()` + `RolesGuard` — papéis `ADMIN` | `STAFF`

**Exemplo:**

```typescript
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN)
@Get('admin-only')
findAll() { ... }
```

---

## Setup

### 1. Dependências

```bash
npm install
```

### 2. Variáveis de ambiente

```bash
cp .env.example .env
```

O `.env.example` cobre banco, app, Swagger, Redis (somente para o Docker Compose) e deve ser ajustado ao seu ambiente. Variáveis principais:

| Variável        | Uso |
| --------------- | --- |
| `DB_*`          | Conexão PostgreSQL (TypeORM) |
| `PORT`          | Porta HTTP (padrão comum no exemplo: `3001`) |
| `NODE_ENV`      | `development` ativa Swagger e Helmet com CSP relaxado |
| `JWT_SECRET`    | Assinatura JWT (obrigatório definir um valor forte em produção) |
| `ALLOWED_ORIGINS` | Origens CORS, separadas por vírgula |
| `TRUST_PROXY`   | `1` ou `true` atrs de proxy (ex.: Render) |
| `SWAGGER_*`     | Título, descrição, versão e path da UI Swagger |
| `REDIS_*`       | Usadas pelo **docker-compose** (nome do container e porta no host); **a API Nest não usa Redis** — veja a seção Docker abaixo |

O tempo de expiração do JWT está definido em `src/config/jwt.config.ts` (`expiresIn`). Ajuste lá ou evolua para ler de env se precisar.

### 3. Banco local com Docker (opcional)

O repositório inclui `docker-compose.yml` com **PostgreSQL 16** e **Redis 7**. Para subir:

```bash
docker compose up -d
```

No `.env` usado pelo Compose, defina também `DB_CONTAINER` (nome do container Postgres), além das variáveis já previstas para o banco e para Redis (`REDIS_CONTAINER`, `REDIS_PORT`). Alinhe `DB_PORT`/`DB_HOST` com a forma como a API acessa o Postgres (ex.: `localhost` e a porta publicada no host).

**Redis:** o template **não** integra Redis no Nest. O serviço no Compose existe para quem quiser adicionar cache, sessão, Bull, rate limit, etc., sem obrigar quem não for usar Redis.

### 4. Migrations

```bash
npm run migration:run
```

### 5. Seed

```bash
npm run seed
```

### 6. Rodar a API

```bash
npm run start:dev
```

- Prefixo global das rotas: **`/api`** (ver `main.ts`).
- URL base típica: `http://localhost:<PORT>/api` — o `<PORT>` vem de `PORT` no `.env` (ex.: `3001`).
- **Swagger** só sobe com `NODE_ENV=development`. Com `SWAGGER_PATH=api/docs` no `.env`, a UI costuma ficar em `http://localhost:<PORT>/api/api/docs` (prefixo global + path). Se preferir `http://localhost:<PORT>/api/docs`, use por exemplo `SWAGGER_PATH=docs`.

---

## Migrations

| Comando | Descrição |
| ------- | --------- |
| `npm run migration:generate --name=NomeDaMigration` | Gera migration a partir das entidades |
| `npm run migration:run` | Aplica pendentes |
| `npm run migration:revert` | Reverte a última |

---

## Usuários padrão (seed)

| Role  | Email           | Senha     |
| ----- | --------------- | --------- |
| Admin | admin@admin.com | Admin@123 |
| Staff | staff@staff.com | Staff@123 |

---

## Testes

Este boilerplate **não inclui** testes unitários ou e2e. A estratégia e a suíte ficam por conta de quem utilizar o template (scripts `npm test` / `test:e2e` permanecem no `package.json` para uso futuro).

---

## Criando um novo módulo

1. Estrutura sugerida:

```
src/modules/novo-modulo/
├── domain/
│   ├── entities/
│   └── repository/
├── application/
│   └── use-cases/
└── infrastructure/
    ├── typeorm/
    └── http/
```

2. Entidade de domínio (sem decorators de ORM).

3. Interface de repositório no domínio (token de injeção + interface).

4. Implementação TypeORM + registro no `Module` Nest.

---

## Estrutura do projeto

```
src/
├── config/            # env, TypeORM builder, JWT, Swagger, validação opcional
├── database/          # DatabaseModule, data-source (CLI), migrations, seeds
├── shared/
│   ├── decorators/
│   ├── exceptions/
│   ├── filter/        # exception filter global
│   └── guards/
├── modules/
│   ├── auth/
│   └── user/
├── app.module.ts
└── main.ts
```

---

## Segurança HTTP

- **Helmet** — headers de segurança; em `development` o CSP fica desabilitado para não quebrar o Swagger UI.
- **CORS** — controlado por `ALLOWED_ORIGINS`.
- **Trust proxy** — `TRUST_PROXY` quando a API roda atrás de reverse proxy.

---

## Tratamento de erros

Exceções derivadas de `AppException` e filtro global (`AppExceptionFilter`). Nos casos de uso, lance a exceção adequada sem `try/catch` no controller.

```typescript
import { ConflictError } from 'src/shared/exceptions/conflict.error';

throw new ConflictError('User already exists');
```

| Classe              | HTTP |
| ------------------- | ---- |
| `BadRequestError`   | 400  |
| `UnauthorizedError` | 401  |
| `ForbiddenError`    | 403  |
| `NotFoundError`     | 404  |
| `ConflictError`     | 409  |

Erros de validação do Nest (`ValidationPipe`) e outras `HttpException` também são normalizados pelo filtro.

---

## Licença

Conforme o campo `license` do `package.json` do repositório.
