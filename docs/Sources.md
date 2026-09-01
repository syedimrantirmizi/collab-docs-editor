# Imported Sources Registry

Track **every** imported component, template, and pattern. Update this file **before or during** each phase — not after.

> Rule: No implementation merge without corresponding entries here for that phase.

---

## Phase 0 — Confirmed sources

| Phase | Feature | Source URL | Import method | Files in repo | Adaptations | License |
|-------|---------|------------|---------------|---------------|-------------|---------|
| 0 | Next.js scaffold | https://nextjs.org/docs/app/getting-started/installation | `npx create-next-app@latest . --yes` | `src/app/*`, config files | `src/` dir, App Router, TS, Tailwind | MIT |
| 0 | shadcn/ui init | https://ui.shadcn.com/docs/installation/next | `npx shadcn@latest init` | `components.json`, `src/components/ui/*` | Teal theme tokens per Design.md | MIT |
| 0 | Login UI block | https://ui.shadcn.com/blocks/login#login-01 | `npx shadcn@latest add login-01` | `src/app/login/*`, `src/components/login-form.tsx` | Split hero panel + refined card; NextAuth wiring | MIT |
| 0 | Dashboard shell | https://ui.shadcn.com/blocks + https://ui.shadcn.com/docs/components/base/empty | `add card empty avatar badge` | `src/app/dashboard/*`, `src/components/dashboard/*` | Product layout, DB-backed doc cards, Empty states | MIT |
| 0 | UI polish pass | `Design.md` §1.1 product-quality bar | Adapt imported blocks | header, login, dashboard | Removed phase/mock copy; surfaces, hover, gradients | — |
| 0 | NextAuth v5 + Credentials | https://nextjs.org/learn/dashboard-app/adding-authentication | npm `next-auth@beta` + auth.config pattern | `src/auth.ts`, `src/auth.config.ts`, `src/middleware.ts` | Prisma user lookup instead of raw SQL | ISC |
| 0 | Prisma + PostgreSQL | https://www.prisma.io/docs/orm/prisma-schema/overview | `npm i prisma@6 @prisma/client` + `npx prisma init` | `prisma/schema.prisma`, `prisma/seed.ts`, `prisma/migrations/*` | Ajaia User/Document/Share models; Prisma 6 ORM | Apache-2.0 |
| 0 | Local Postgres | https://hub.docker.com/_/postgres | `docker-compose.yml` | `docker-compose.yml` | Port 5432, db `ajaia_docs` | — |
| 0 | Fonts | https://nextjs.org/docs/app/building-your-application/optimizing/fonts | `next/font/google` Inter + Source Serif 4 | `src/app/layout.tsx` | UI vs editor font vars | MIT |

---

## Phase 0 — Planned sources (research pending)

| Feature | Candidate source | Status |
|---------|-------------------|--------|
| — | — | ✅ Complete — see registry above |

---

## Phase 1 — Confirmed sources

| Phase | Feature | Source URL | Import method | Files in repo | Adaptations | License |
|-------|---------|------------|---------------|---------------|-------------|---------|
| 1 | TipTap + Next.js | https://tiptap.dev/docs/editor/getting-started/install/nextjs | `npm i @tiptap/react @tiptap/pm @tiptap/starter-kit …` | `src/components/editor/document-editor.tsx` | immediatelyRender false, JSON persistence | MIT |
| 1 | Extended formatting | https://tiptap.dev/docs/editor/extensions/functionality/textalign + link + highlight + color | npm `@tiptap/extension-*` | `src/lib/editor-extensions.ts`, `editor-toolbar.tsx` | Align, strike, H3, link, lists, blocks, colors | MIT |
| 1 | TipTap styling | https://tiptap.dev/docs/editor/getting-started/style-editor | `.tiptap` CSS in globals | `src/app/globals.css` | Serif editor font, heading/list styles | MIT |
| 1 | shadcn toggles | https://ui.shadcn.com/docs/components/toggle | `npx shadcn add toggle toggle-group` | `src/components/ui/toggle*.tsx` | Toolbar active states | MIT |
| 1 | Auto-save debounce | TipTap onUpdate + standard debounce pattern | Client-side setTimeout 1500ms | `document-editor.tsx` | PATCH `/api/documents/[id]` | — |
| 1 | Permissions (custom) | `Architecture.md` | Hand-written | `src/lib/permissions.ts` | canRead/canWrite for owner + shares | — |

---

## Phase 1 — Planned sources (research pending)

| Feature | Candidate source | Status |
|---------|-------------------|--------|
| — | — | ✅ Complete — see registry above |

---

## Phase 2 — Confirmed sources

| Phase | Feature | Source URL | Import method | Files in repo | Adaptations | License |
|-------|---------|------------|---------------|---------------|-------------|---------|
| 2 | Toast notifications | https://ui.shadcn.com/docs/components/sonner | `npx shadcn add sonner` | `src/components/ui/sonner.tsx`, `src/app/layout.tsx` | Save/delete/load error toasts; light theme | MIT |
| 2 | Delete confirmation | https://ui.shadcn.com/docs/components/alert-dialog | `npx shadcn add alert-dialog` | `delete-document-dialog.tsx` | Owner-only delete with destructive action | MIT |
| 2 | Loading skeletons | https://ui.shadcn.com/docs/components/skeleton | `npx shadcn add skeleton` | `dashboard-skeleton.tsx`, `dashboard/loading.tsx` | Dashboard card grid placeholders | MIT |
| 2 | Link dialog (Phase 1 carry-over) | https://ui.shadcn.com/docs/components/dialog | `npx shadcn add dialog` | `link-dialog.tsx` | Replaces `window.prompt` for URLs | MIT |
| 2 | Document list API | `Phases.md` + Prisma findMany pattern | Hand-written route | `src/app/api/documents/route.ts` GET | Owned docs sorted by `updatedAt` desc | — |
| 2 | Delete API | `Architecture.md` permissions | Hand-written route | `src/app/api/documents/[id]/route.ts` DELETE | Owner-only via `canDelete` | — |

---

## Phase 3 — Confirmed sources

| Phase | Feature | Source URL | Import method | Files in repo | Adaptations | License |
|-------|---------|------------|---------------|---------------|-------------|---------|
| 3 | DOCX parsing | https://github.com/mwilliamson/mammoth.js | `npm install mammoth` | `src/lib/import/parse-file.ts` | convertToHtml → TipTap JSON | BSD-2-Clause |
| 3 | Markdown parsing | https://marked.js.org | `npm install marked` | `src/lib/import/parse-file.ts` | marked → HTML → TipTap JSON | MIT |
| 3 | HTML → TipTap JSON | https://tiptap.dev/docs/editor/api/utilities/html | `npm install @tiptap/html` | `parse-file.ts`, `editor-extensions.ts` | Shared `getContentExtensions()` | MIT |
| 3 | Import dialog UI | https://ui.shadcn.com/docs/components/dialog + radio-group | Existing dialog + `add radio-group` | `import-file-dialog.tsx` | Replace/append mode for editor | MIT |
| 3 | Plain text → TipTap | TipTap JSON doc structure | Hand-written helper | `text-to-tiptap.ts` | Paragraphs + hard breaks | — |
| 3 | Import APIs | `Phases.md` multipart pattern | Hand-written routes | `api/documents/import`, `api/documents/[id]/import` | Auth + permissions + merge | — |

---

## Phase 4 — Confirmed sources

| Phase | Feature | Source URL | Import method | Files in repo | Adaptations | License |
|-------|---------|------------|---------------|---------------|-------------|---------|
| 4 | Share dialog UI | https://ui.shadcn.com/docs/components/dialog + radio-group | Existing dialog/radio patterns | `share-dialog.tsx` | Email + Editor/Viewer roles, access list | MIT |
| 4 | Share API | `Phases.md` + Prisma upsert | Hand-written route | `api/documents/[id]/share/route.ts` | Owner-only, email lookup, role upsert | — |
| 4 | Permissions | `Architecture.md` | Pre-existing helpers | `permissions.ts` | canRead/canWrite/canShare/canDelete | — |
| 4 | Dashboard shared section | Phase 0 dashboard shell | Pre-existing query/UI | `queries/documents.ts`, dashboard | Owned vs Shared badges | — |
| 4 | Documents list API | `Phases.md` | Updated GET route | `api/documents/route.ts` | Returns `{ owned, shared }` | — |

---

## Phase 5 — Planned sources (research pending)

See `ImportFirst.md` §4. Entries will be added when each phase starts.

---

## Phase 5 — Confirmed sources

| Phase | Feature | Source URL | Import method | Files in repo | Adaptations | License |
|-------|---------|------------|---------------|---------------|-------------|---------|
| 5 | Unit tests | https://vitest.dev | `npm install -D vitest` | `permissions.test.ts`, `vitest.config.ts` | Permissions matrix | MIT |
| 5 | E2E tests | https://playwright.dev | `npm install -D @playwright/test` | `e2e/editor-flow.spec.ts`, `playwright.config.ts` | Login → edit → save → reload | Apache-2.0 |
| 5 | CI | GitHub Actions + Postgres service | `.github/workflows/ci.yml` | Runs vitest + Playwright on push | — | — |
| 5 | Vercel deploy | https://vercel.com/docs | `vercel.json` buildCommand | `prisma migrate deploy && next build` | Neon Postgres prod | — |
| 5 | Deployment guide | Neon + Vercel docs | Hand-written | `docs/DEPLOYMENT.md` | Neutral GitHub repo name | — |

---

## Rejected Sources

| URL | Reason rejected |
|-----|-----------------|
| YouTube tutorials | Prefer official docs over video walkthroughs for imports |
| Prisma 8 create-prisma only flow | Using established Prisma ORM schema + migrate pattern for Next.js compatibility |
