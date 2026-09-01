# Import-First Development (MANDATORY)

> **Hard rule:** We do **not** build UI, editor, auth, or boilerplate from scratch. We **find, import, and adapt** existing components and patterns from the web first. Only irreplaceable product-specific logic is written manually.

This applies to **every phase** and **every feature**.

---

## 1. The Rule

| ✅ Do | ❌ Don't |
|------|---------|
| Crawl/search the web for existing components, templates, examples | Hand-write a login form, toolbar, dashboard, or editor from a blank file |
| Import via CLI (`shadcn add`, `npx create-next-app`, Prisma init) | Reinvent layout, buttons, dialogs, or form patterns |
| Copy official docs/examples and **edit** to fit Ajaia Docs | Generate large greenfield files from AI without a source URL |
| Use starter repos / blocks / UI kits as starting points | Custom CSS component library from zero |
| Document every source in `Sources.md` before merge | Ship code with unknown or untracked origins |

**"From scratch" is allowed only for:**

- **Product-specific glue** — e.g. `canRead` / `canWrite` for our share model
- **API wiring** — route handlers that connect imported patterns to our Prisma schema
- **Zod schemas** — shaped to our endpoints (can mirror examples)
- **Seed data** — demo users and sample documents
- **Config** — env, theme tokens, path aliases

If a piece exists in an official example, template, or OSS repo → **import it**.

---

## 2. Workflow (every feature)

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────┐
│  1. RESEARCH │ → │  2. SELECT   │ → │  3. IMPORT  │ → │  4. ADAPT    │
│  Web crawl   │    │  Best source │    │  CLI / copy │    │  Edit + wire │
└─────────────┘    └──────────────┘    └─────────────┘    └──────────────┘
                                                                    │
                                                                    ▼
                                                          ┌──────────────┐
                                                          │  5. DOCUMENT │
                                                          │  Sources.md  │
                                                          └──────────────┘
```

### Step 1 — Research (required before coding)

For each deliverable, search for:

- Official documentation examples (preferred)
- shadcn/ui blocks and registry items
- TipTap / NextAuth / Prisma official guides
- GitHub templates (Next.js + TipTap, NextAuth credentials, etc.)
- UI resource sites (see §3)
- Stack Overflow / GitHub issues for specific integration patterns

**Tools:** Firecrawl, web search, GitHub search, official doc sites, shadcn MCP.

**Output:** Short list of 2–3 candidate sources with URLs in `Sources.md` (or phase notes).

### Step 2 — Select

Pick the source that:

- Matches our stack (Next.js App Router, TS, Tailwind)
- Has a compatible license (MIT, Apache 2.0, etc.)
- Requires the least modification
- Is maintained or from official docs

**Stakeholder can approve source choice for large imports.**

### Step 3 — Import

Use the **canonical import path** for that ecosystem:

| Type | Import method |
|------|----------------|
| shadcn components | `npx shadcn@latest add button card dialog …` |
| Next.js app | `create-next-app` template or official example clone |
| TipTap editor | Copy from [TipTap UI examples](https://tiptap.dev/docs/examples) / GitHub demos |
| Auth | NextAuth official Credentials example |
| Prisma | Official schema patterns + `prisma init` |
| Tests | Playwright/Vitest official getting-started snippets |
| Icons | `lucide-react` (already bundled with shadcn) |

Paste/adapt — do not retype from memory.

### Step 4 — Adapt

Edits allowed:

- Rename, re-path, re-theme (per `Design.md`)
- Connect to our API routes and Prisma models
- Trim unused features from the template
- Add permission checks and validation

Edits **not** allowed without new research:

- Rewriting the whole component because "it's cleaner"
- Replacing an imported editor with a custom `contentEditable` div

### Step 5 — Document

Every imported file or pattern → row in **`Sources.md`**:

- URL
- What was taken
- What was changed
- License (if applicable)

---

## 3. Approved Source Categories

### Tier 1 — Primary (use first)

| Source | Use for |
|--------|---------|
| [shadcn/ui](https://ui.shadcn.com) | All UI primitives, blocks, forms, dialogs |
| [TipTap docs & examples](https://tiptap.dev) | Editor, toolbar, extensions, JSON persistence |
| [Next.js examples](https://github.com/vercel/next.js/tree/canary/examples) | App structure, API routes, middleware |
| [Auth.js / NextAuth docs](https://authjs.dev) | Credentials provider, session, middleware |
| [Prisma docs & examples](https://www.prisma.io/docs) | Schema, migrations, seed |
| [Vercel templates](https://vercel.com/templates) | Full-stack starters |

### Tier 2 — UI blocks & patterns

| Source | Use for |
|--------|---------|
| [ui.shadcn.com/blocks](https://ui.shadcn.com/blocks) | Dashboard layouts, login cards |
| [21st.dev](https://21st.dev) | Enhanced UI blocks (adapt to shadcn) |
| [Magic UI](https://magicui.design) | Optional polish (only if adapted, not raw copy without license check) |
| Official Radix UI examples | When shadcn doesn't cover a pattern |

### Tier 3 — Reference only (adapt, don't copy blindly)

| Source | Notes |
|--------|-------|
| Random GitHub gists | Verify license and maintenance |
| CodePen / StackBlitz | Proof of concept only; rewrite into our structure |
| AI-generated snippets | **Not a source** — must trace to Tier 1/2 or reject |

---

## 4. Phase-by-Phase Source Targets

Preliminary research targets (finalize in `Sources.md` before each phase):

| Phase | Import from (starting points) |
|-------|----------------------------|
| **0** | `create-next-app`, shadcn init, NextAuth credentials example, Prisma quickstart |
| **1** | TipTap "Simple editor" / "Menus" examples, shadcn button group for toolbar |
| **2** | shadcn blocks: dashboard sidebar or card grid, empty state patterns |
| **3** | mammoth/marked npm docs examples; shadcn file input pattern |
| **4** | shadcn dialog + combobox; Prisma many-to-many share examples |
| **5** | Playwright official Next.js guide; Vercel deploy docs |

---

## 5. Custom-Only Boundary (exhaustive list)

These are the **only** files/logic expected to be written primarily from scratch:

| Item | Why custom |
|------|------------|
| `lib/permissions.ts` | Ajaia-specific owner/share/viewer rules |
| `lib/validators.ts` | Our API contract (Zod — may mirror examples) |
| `prisma/schema.prisma` | Our models (structure may follow Prisma docs) |
| `prisma/seed.ts` | Demo users for exercise |
| API route **business logic** | Connects imports to our DB — thin handlers |
| `Sources.md` | Provenance tracking |

Everything else should trace to an imported source.

---

## 6. Review Checklist (per PR / phase)

- [ ] Research step completed — URLs listed before implementation
- [ ] No new UI component written without shadcn/Tier 1/2 source
- [ ] TipTap setup copied from official example, not reinvented
- [ ] Auth copied from NextAuth official pattern
- [ ] `Sources.md` updated with all imports
- [ ] License compatible for any copied code
- [ ] AI-generated code reviewed and tied to a human-verified source

---

## 7. AI Usage Under Import-First

AI (Cursor, etc.) is a **search and adaptation assistant**, not a greenfield generator:

| AI role | Allowed |
|---------|---------|
| Find and summarize web examples | ✅ |
| Adapt imported code to our schema | ✅ |
| Write permission/glue logic | ✅ |
| Invent entire editor/dashboard from prompt | ❌ |
| Skip source documentation | ❌ |

Record in `AI_WORKFLOW.md`: which sources AI found, what was kept, what was rejected.

---

## 8. Acceptance (MVP)

MVP is not complete unless:

- [ ] `Sources.md` covers all major UI and integration areas
- [ ] README links to import-first approach
- [ ] Reviewer can see provenance for editor, auth, and dashboard

**Sign-off on import-first rule:** _________________ **Date:** _________________
