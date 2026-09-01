# Imported Sources Registry

Track **every** imported component, template, and pattern. Update this file **before or during** each phase — not after.

> Rule: No implementation merge without corresponding entries here for that phase.

---

## Phase 0 — Confirmed sources

| Phase | Feature | Source URL | Import method | Files in repo | Adaptations | License |
|-------|---------|------------|---------------|---------------|-------------|---------|
| 0 | Next.js scaffold | https://nextjs.org/docs/app/getting-started/installation | `npx create-next-app@latest . --yes` | `src/app/*`, config files | `src/` dir, App Router, TS, Tailwind | MIT |
| 0 | shadcn/ui init | https://ui.shadcn.com/docs/installation/next | `npx shadcn@latest init` | `components.json`, `src/components/ui/*` | Teal theme tokens per Design.md | MIT |
| 0 | Login UI block | https://ui.shadcn.com/blocks/login#login-01 | `npx shadcn@latest add login-01` | `src/app/login/*`, `src/components/login-form.tsx` | Wire to NextAuth signIn; remove Google/signup links | MIT |
| 0 | Dashboard shell | https://ui.shadcn.com/blocks (card patterns) + shadcn `card`, `button` | `npx shadcn@latest add card button badge separator` | `src/app/dashboard/page.tsx` | Ajaia Docs branding, empty state | MIT |
| 0 | NextAuth v5 + Credentials | https://nextjs.org/learn/dashboard-app/adding-authentication | npm `next-auth@beta` + auth.config pattern | `src/auth.ts`, `src/auth.config.ts`, `src/middleware.ts` | Prisma user lookup instead of raw SQL | ISC |
| 0 | Prisma + PostgreSQL | https://www.prisma.io/docs/orm/prisma-schema/overview | `npm i prisma @prisma/client -D` + `npx prisma init` | `prisma/schema.prisma`, `prisma/seed.ts` | Ajaia User/Document/Share models | Apache-2.0 |
| 0 | Local Postgres | https://hub.docker.com/_/postgres | `docker-compose.yml` | `docker-compose.yml` | Port 5432, db `ajaia_docs` | — |
| 0 | Fonts | https://nextjs.org/docs/app/building-your-application/optimizing/fonts | `next/font/google` Inter + Source Serif 4 | `src/app/layout.tsx` | UI vs editor font vars | MIT |

---

## Phase 0 — Planned sources (research pending)

| Feature | Candidate source | Status |
|---------|-------------------|--------|
| — | — | ✅ Complete — see registry above |

---

## Phase 1 — Planned sources (research pending)

| Feature | Candidate source | Status |
|---------|-------------------|--------|
| TipTap editor | https://tiptap.dev/docs/examples/default | 🔍 To confirm |
| Toolbar | TipTap UI Components / Menus example | 🔍 To confirm |
| Auto-save debounce | TipTap or React hook example from docs | 🔍 To confirm |

---

## Phase 2–5 — Planned sources (research pending)

See `ImportFirst.md` §4. Entries will be added when each phase starts.

---

## Rejected Sources

| URL | Reason rejected |
|-----|-----------------|
| YouTube tutorials | Prefer official docs over video walkthroughs for imports |
| Prisma 8 create-prisma only flow | Using established Prisma ORM schema + migrate pattern for Next.js compatibility |
