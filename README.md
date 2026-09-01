# Ajaia Docs

Lightweight collaborative document editor (Google Docs–inspired MVP).

**MVP complete (Phases 0–5):** Auth, TipTap editor, dashboard, import, sharing, tests, and deployment docs.

## Prerequisites

- Node.js 20+
- PostgreSQL locally (Docker recommended) or native PostgreSQL 16+

## Quick start

### 1. Install dependencies

```bash
npm install
```

### 2. Start PostgreSQL

**Option A — Docker (recommended)**

```bash
docker compose up -d
```

Uses credentials from `.env.example`: `ajaia` / `ajaia`.

**Option B — Native PostgreSQL**

Install PostgreSQL 16+, create database `ajaia_docs`, and set `DATABASE_URL` in `.env` to match your local user/password.

### 3. Environment

```bash
cp .env.example .env
```

Generate a production `AUTH_SECRET`:

```bash
openssl rand -hex 32
```

### 4. Database setup

```bash
npm run db:migrate
npm run db:seed
```

### 5. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo accounts

| Email | Password |
|-------|----------|
| `alice@ajaia.test` | `password123` |
| `bob@ajaia.test` | `password123` |
| `charlie@ajaia.test` | `password123` |

## Supported import formats

| Format | Notes |
|--------|--------|
| `.txt` | Plain text → paragraphs |
| `.md` | Markdown → rich text |
| `.docx` | Text extraction (layout not preserved) |

Max file size: **5 MB**

## Testing

Requires local Postgres with migrations and seed applied.

```bash
npm run test          # Vitest — permissions matrix
npm run test:e2e      # Playwright — login → edit → save → reload
npm run test:e2e:ui   # Playwright interactive UI
```

CI runs both suites on push (see `.github/workflows/ci.yml`).

## Production

Deployment uses a **neutral GitHub repo name** (not “ajaia”), **Vercel**, and **Neon Postgres**.

Full step-by-step: **[docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)**

Recommended repo name: `collab-docs-editor`

- **URL:** [collab-docs-editor.vercel.app](https://collab-docs-editor.vercel.app)
- **Repo:** [github.com/syedimrantirmizi/collab-docs-editor](https://github.com/syedimrantirmizi/collab-docs-editor)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build (local) |
| `npm run test` | Unit tests |
| `npm run test:e2e` | End-to-end tests |
| `npm run db:migrate` | Apply Prisma migrations (dev) |
| `npm run db:migrate:deploy` | Apply migrations (production) |
| `npm run db:seed` | Seed demo users |
| `npm run db:studio` | Open Prisma Studio |

## Reviewer docs

| Doc | Purpose |
|-----|---------|
| [ARCHITECTURE_NOTE.md](./ARCHITECTURE_NOTE.md) | Priorities and tradeoffs |
| [AI_WORKFLOW.md](./AI_WORKFLOW.md) | How the MVP was built with AI |
| [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) | GitHub → Vercel → Neon guide |

## Project documentation

Planning docs live in [`docs/`](./docs/):

- [Decisions.md](./docs/Decisions.md) — approved product choices
- [ImportFirst.md](./docs/ImportFirst.md) — import-first development rule
- [Sources.md](./docs/Sources.md) — imported component registry
- [Phases.md](./docs/Phases.md) — implementation phases

## Stack

Next.js 16 · TypeScript · Tailwind · shadcn/ui · NextAuth v5 · Prisma 6 · PostgreSQL · TipTap 3

## Import-first

UI and auth patterns are imported from official sources (shadcn blocks, Next.js learn auth guide). See `docs/Sources.md` for provenance.

## Design quality

All screens must look like a **real, shippable product** — not a mock or wireframe. See [`docs/Design.md`](./docs/Design.md) §1.1.
