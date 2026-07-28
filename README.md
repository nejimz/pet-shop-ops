# Pet Shop Ops

Internal staff app for pet shop operations: **consultation booking**, **owner/pet records**, and **supply sales** with full history.

## Documentation

- [Product Requirements (PRD)](docs/PRD.md) — goals, roles, features, screens, acceptance criteria
- [Tech Stack](docs/TECH_STACK.md) — architecture, versions, API surface, data model, env

## Monorepo packages

| Package | Path | Description |
|---------|------|-------------|
| `@petshop/api` | `packages/api` | NestJS REST API + Prisma (SQLite) |
| `@petshop/web` | `packages/web` | Next.js staff UI |
| `@petshop/shared` | `packages/shared` | Shared enums, Zod schemas, types |

## Getting started

Source trees and workspace `package.json` files are not currently present in this checkout (compiled `dist` / `.next` artifacts and the SQLite DB may remain). Restore application source against [docs/TECH_STACK.md](docs/TECH_STACK.md) before installing or running.

Once restored, the expected local flow is:

```bash
pnpm install
# configure .env / packages/api/.env / packages/web/.env.local (see TECH_STACK.md)
pnpm --filter api dev    # API on :3001
pnpm --filter web dev    # Next.js web app
```
