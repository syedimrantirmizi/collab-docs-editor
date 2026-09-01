# AI Workflow

How this project was built with AI assistance and import-first rules.

## Process

1. **Documentation first** — PRD, architecture, phases, design bar, and import-first rules were written and approved before coding.
2. **Phase gates** — Each phase (0–5) required stakeholder go-ahead; implementation followed `docs/Phases.md`.
3. **Import-first (mandatory)** — No scratch UI/editor/auth. Web research → CLI import (shadcn, TipTap, NextAuth patterns) → adapt → log in `docs/Sources.md`.
4. **Product-quality bar** — Every screen checked against `docs/Design.md` §1.1 (not mock/wireframe UI).

## Tools used

| Tool | Used for |
|------|----------|
| **Cursor Agent** | Implementation, refactors, test + deploy setup |
| **shadcn CLI** | UI components and login block |
| **Official docs** | Next.js, TipTap, NextAuth, Prisma, marked, mammoth |
| **npm / create-next-app** | Scaffold and dependencies |
| **Vitest** | Permissions unit tests |
| **Playwright** | E2E happy path (login → edit → save → reload) |
| **Docker Compose** | Local Postgres option (when available) |

## Verified patterns

- NextAuth v5 Credentials + Prisma user lookup
- TipTap JSON persist via PATCH API + debounced client save
- shadcn Dialog / AlertDialog / Sonner instead of browser alerts
- mammoth + marked + `@tiptap/html` for file import pipeline
- Prisma migrate deploy on Vercel build (`vercel.json`)

## Rejected / avoided

- Scratch-built login, dashboard, or toolbar
- `window.prompt` / `alert` for link or confirm flows
- Prisma 8 RC config-only workflow (stayed on Prisma 6 ORM standard)
- Real-time collab (Yjs/Hocuspocus) — explicitly deferred in PRD
- Public signup — out of scope for v1

## Source tracking

Every imported block or official pattern is recorded in **`docs/Sources.md`** with URL, import method, and adaptations.

## Deployment workflow (Phase 5)

Order enforced by stakeholder:

1. **Run tests locally** — `npm run test` and `npm run test:e2e`
2. **Create neutral GitHub repo** — see `docs/DEPLOYMENT.md` (no “ajaia” in repo name)
3. **Push code** — `main` branch
4. **Provision Neon Postgres** — production `DATABASE_URL`
5. **Connect Vercel to GitHub** — set env vars, deploy
6. **Seed demo users once** — `npm run db:seed` against production (documented in DEPLOYMENT.md)

## Reviewer note

Demo credentials and supported import types are in **`README.md`**. Architecture tradeoffs are in **`ARCHITECTURE_NOTE.md`**.
