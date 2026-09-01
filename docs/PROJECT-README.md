# Ajaia Docs — Project Documentation

Lightweight collaborative document editor (Google Docs–inspired MVP).

> **Status:** Documentation approved — ready for Phase 0 on your go-ahead.

## Documentation Index

| Document | Purpose |
|----------|---------|
| [Prd.md](./Prd.md) | Product requirements, users, features, acceptance criteria |
| [Architecture.md](./Architecture.md) | Tech stack, data model, API, folder structure |
| [Rules.md](./Rules.md) | Engineering conventions and AI boundaries |
| [Phases.md](./Phases.md) | Phased implementation plan |
| [Design.md](./Design.md) | Colors, typography, layout, components |
| [**ImportFirst.md**](./ImportFirst.md) | **MANDATORY:** import-first workflow — no scratch building |
| [Sources.md](./Sources.md) | Registry of imported components, URLs, and adaptations |
| [**Decisions.md**](./Decisions.md) | **Approved** product choices (auth, sharing, design, DB) |

## Quick Summary

**Build:** Browser-based doc editor with rich text, file import, sharing, and persistence.

**How we build:** **Import-first** — crawl web → import components/templates (shadcn, TipTap, official examples) → edit and wire. Custom code only for permissions, API glue, and seed data.

**Stack (planned):** Next.js 15 · TypeScript · TipTap · Prisma · PostgreSQL · NextAuth · Tailwind/shadcn · Vercel

**MVP phases:** Foundation → Editor → Dashboard → Import → Sharing → Tests & Deploy

## Approved decisions (summary)

See **`Decisions.md`** for full detail.

- **Auth:** Seeded accounts only (`alice@ajaia.test`, `bob@ajaia.test`)
- **Sharing:** Editor + Viewer roles
- **Import:** New doc from dashboard + import into current document in editor
- **Design:** Light, teal accent, card dashboard, Inter + serif editor
- **DB:** Local PostgreSQL (Docker); hosted DB at deploy
- **Build:** Import-first — no scratch UI/editor/auth

## Next Steps

1. Say **"start Phase 0"** to begin web research + scaffold
2. Phase 0 will populate `Sources.md` with confirmed import URLs
3. Each phase pauses for your review before the next

## Implementation (coming soon)

Setup and run instructions will be added when Phase 0 is complete.
