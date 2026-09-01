# Architecture Note

One-page summary of priorities and tradeoffs for this MVP.

## Product scope

A **single-workspace document editor** with seeded auth, rich-text editing, file import, and owner-controlled sharing. Real-time collaboration, signup, and attachment storage are intentionally out of scope.

## Stack choices

| Layer | Choice | Why |
|-------|--------|-----|
| App | Next.js 16 App Router | Official scaffold, RSC + API routes in one repo |
| UI | shadcn/ui + Tailwind v4 | Import-first, product-grade blocks, fast theming |
| Editor | TipTap 3 | Official React integration, JSON persistence, extension ecosystem |
| Auth | NextAuth v5 Credentials | Matches seeded-account requirement; no OAuth setup |
| DB | Prisma 6 + PostgreSQL | Typed schema, migrations, simple local + Neon prod path |

## Permission model

Access is computed in **`src/lib/permissions.ts`** from document ownership and `DocumentShare` rows:

- **Owner** — read, write, share, delete
- **Editor (shared)** — read, write
- **Viewer (shared)** — read only (UI + API enforced)

API routes call `getReadableDocument` / `getWritableDocument` before returning or mutating data. Unauthorized access returns **404** (not 403) to avoid leaking document existence.

## Persistence

- Documents store **TipTap JSON** in a Postgres `Json` column.
- Auto-save debounces title (~800ms) and content (~1.5s) from the client.
- Imports parse files server-side (txt/md/docx) and convert to TipTap JSON before save.

## Import-first development

UI shells, auth patterns, and editor baseline were **imported** from official sources (shadcn blocks, TipTap docs, Next.js learn guide) and adapted. Custom code is limited to permissions, API wiring, import parsers, and product-specific flows. See **`docs/Sources.md`**.

## Deferred / rejected for v1

- Real-time multi-cursor editing
- Public signup and email delivery
- `.docx` layout fidelity (text extraction only)
- Browser `alert` / `prompt` for UX (replaced with dialogs + toasts)

## Deployment shape

- **GitHub** — neutral public repo name (see `docs/DEPLOYMENT.md`), not tied to client branding in the repo slug
- **Vercel** — Next.js hosting; `vercel.json` runs `prisma migrate deploy` before build
- **Neon Postgres** — managed production database; demo users seeded once after first deploy

## Main tradeoff

We optimized for **reviewable MVP velocity** and **import-first consistency** over building a bespoke design system or real-time collaboration infrastructure. The result is a deployable product loop that can be extended later without rewriting the core editor or auth model.
