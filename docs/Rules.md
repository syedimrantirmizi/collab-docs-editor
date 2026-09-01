# Ajaia Docs — Engineering Rules & AI Boundaries

Rules for humans and AI assistants working on this codebase. Follow these during implementation.

---

## 1. Principles

1. **Import-first, never scratch-build (MUST)** — Before writing code, crawl the web and import components, templates, and patterns from official docs, shadcn, TipTap examples, starter repos, and UI libraries. **Edit and wire** imports; do not greenfield UI, editor, auth, or boilerplate. See **`ImportFirst.md`** and log provenance in **`Sources.md`**.
2. **Product-grade visuals (MUST)** — UI must look like a **real, shippable product**: polished blocks, proper surfaces/spacing/typography, complete empty states — **not** a mock or wireframe. See **`Design.md` §1.1** and §14.
3. **Ship the core loop first** — create, edit, save, reopen before polish features.
3. **Small, reviewable diffs** — one concern per PR/commit when possible.
4. **Server-side authorization always** — never trust client-only permission checks.
5. **Preserve editor JSON faithfully** — avoid round-trips that strip formatting.
6. **Explicit over clever** — readable code beats abstraction for this scope.

---

## 2. What We Do

### Import-first workflow (mandatory)
- **Research before code** — web search / crawl for 2–3 candidate sources per feature; record in `Sources.md`.
- **CLI and official imports first** — `create-next-app`, `shadcn add`, Prisma init, npm packages with doc examples.
- **Adapt, don't rewrite** — trim, theme, and connect imports to our API; keep upstream structure where possible.
- **Custom-only boundary** — manually author only: `permissions.ts`, thin API glue, Zod validators, seed data (see `ImportFirst.md` §5).
- **No merge** without updated `Sources.md` rows for that phase.

### Stack & patterns
- Use **Next.js App Router** with TypeScript strict mode enabled.
- Use **TipTap** for rich text; store **TipTap JSON** in PostgreSQL.
- Use **Prisma** for all database access (no raw SQL unless necessary).
- Use **Zod** for request validation at API boundaries.
- Use **shadcn/ui** components; extend via composition, not forked copies.
- Use **Server Components** for data-fetching pages; **Client Components** only where needed (editor, dialogs, interactive lists).

### Code organization
- Colocate feature components under `src/components/{feature}/`.
- Shared logic in `src/lib/` — auth, permissions, validators, import parsers.
- One permissions module (`permissions.ts`) — single source for `canRead` / `canWrite` / `canShare`.

### Auth & security
- Check session on every protected API route and page.
- Hash passwords with bcrypt (demo accounts only).
- Return generic login errors ("Invalid credentials") — no user enumeration.
- Validate file upload size (e.g. max 5MB) and extension allowlist.

### UX
- **Product-quality UI** — import polished blocks; theme per `Design.md`; no mock-looking screens.
- Show save state: Saving / Saved / Error.
- Disable editor toolbar actions for VIEWER role.
- List accepted import formats in UI and README.
- Distinguish **My documents** vs **Shared with me** visually (section headers + badges).

### Testing & quality
- At minimum: one **Playwright E2E** (login → create doc → type → save → reload) OR one **Vitest integration** on permissions + document service.
- Run `lint` and `typecheck` before merge.
- Document env setup in README with `.env.example`.

### Documentation
- Update README when behavior or env vars change.
- Keep `ARCHITECTURE_NOTE.md` short (priorities + tradeoffs).
- Keep `AI_WORKFLOW.md` honest about AI usage and verification.

---

## 3. What We Avoid

### Libraries & tech
| Avoid | Use instead | Reason |
|-------|-------------|--------|
| `framer-motion` for MVP | CSS transitions / Tailwind | Scope control |
| Multiple rich-text libs | TipTap only | Consistency |
| Raw HTML storage as primary | TipTap JSON | Formatting fidelity |
| MongoDB for this schema | PostgreSQL + Prisma | Relational shares/users |
| Custom auth from scratch | NextAuth Credentials | Battle-tested sessions |
| Heavy state libs (Redux) | React state + URL + server fetch | YAGNI |
| Real-time collab libs (Yjs, Liveblocks) | Deferred | Out of MVP scope |

### Anti-patterns
- **No mock / wireframe UI** — bare cards, placeholder-only empty states, stock template copy, or unstyled layouts are not acceptable deliverables.
- **No browser `alert`, `confirm`, or `prompt`** — use shadcn `Dialog` / in-app modals for user input and messages.
- **No scratch-building** — custom login pages, toolbars, dashboards, editors, or layout systems when an import exists.
- **No** implementing a feature before documenting candidate sources.
- **No** client-only route protection without middleware/API checks.
- **No** storing secrets in repo or client bundles.
- **No** `any` without comment justification.
- **No** silent catch blocks — log server errors, show user-safe messages.
- **No** large AI-generated files pasted without review, source URL, and trimming.
- **No** scope creep (comments, templates, AI writing assistant) unless approved.

### File handling
- Do not claim .docx **layout** preservation — text/structure only.
- Do not accept arbitrary file types without validation.
- Do not store uploaded binary files in v1 unless product explicitly adds attachments.

---

## 4. Error Handling Rules

```typescript
// API routes: consistent shape
return NextResponse.json(
  { error: 'You do not have access to this document', code: 'FORBIDDEN' },
  { status: 403 }
);
```

- **400** — validation failed (show field/message)
- **401** — not logged in → redirect to login
- **403** — logged in but no permission
- **404** — document not found OR no access (choose one policy; recommend 404 for both to avoid leaking IDs)
- **500** — log full error server-side; client sees generic message

Editor save failures: keep local content, show retry, do not navigate away without warning if unsaved.

---

## 5. Naming & Style

- **Files:** kebab-case (`document-list.tsx`)
- **Components:** PascalCase
- **API routes:** RESTful nouns, plural collections
- **DB:** camelCase in Prisma, snake_case only if DB convention requires
- **Commits:** conventional commits optional (`feat:`, `fix:`, `docs:`)

---

## 6. AI Assistant Boundaries

When using AI (Cursor, Copilot, ChatGPT, etc.):

### AI may
- **Search the web** and summarize import candidates (Firecrawl, docs, GitHub)
- Run CLI scaffolds (`shadcn add`, official examples) and adapt output
- Draft tests from official Playwright/Vitest templates
- Suggest Zod schemas mirroring documented patterns
- Refactor imported code for clarity when behavior unchanged

### AI must not (without human review)
- **Generate greenfield UI or editor code** without a documented Tier 1/2 source URL
- Invent auth flows that bypass server checks
- Add dependencies not in Architecture.md without approval
- Copy GPL/unlicensed code blindly
- Skip `Sources.md` updates for imported files
- Deploy with placeholder secrets or skip env validation

### Human verification required
- All **authorization** paths manually traced
- **Import parsers** tested with sample .txt, .md, .docx files
- **E2E test** run green locally before deploy
- **UI** checked in browser for editor toolbar and share dialog
- **AI_WORKFLOW.md** updated with what was accepted vs rejected

### Prompt discipline
- Reference `Prd.md`, `Architecture.md`, and this file before codegen.
- Ask for phased implementation — do not generate entire app in one shot.
- Prefer editing existing files over duplicating components.

---

## 7. Git & Review

- Do not commit `.env`, `node_modules`, or local SQLite unless explicitly chosen (we use Postgres).
- PR/description should state which phase/task is complete.
- User approval required before starting each phase (per project process).

---

## 8. Performance Budget (MVP)

- Dashboard load: < 2s on broadband
- Editor first paint: < 1.5s after navigation
- Auto-save debounce: 1500ms (tunable 1000–2000ms)
- Max upload: 5MB

---

## 9. Accessibility Minimum

- Login form labels associated with inputs
- Toolbar buttons have `aria-label` or visible text
- Heading levels not skipped in imported content where possible
- Focus visible on interactive elements (shadcn default)

---

## 10. Definition of Done (per feature)

- [ ] **Sources researched and logged in `Sources.md`**
- [ ] **Implementation imported/adapted — not scratch-built** (except custom-only boundary)
- [ ] **Visual QA passed** (`Design.md` §14) — looks like a real product, not a mock
- [ ] Matches PRD acceptance criteria for that feature
- [ ] Authorized correctly on server
- [ ] Error states handled
- [ ] Works after page refresh
- [ ] No new linter/type errors
- [ ] Documented in README if user-facing
