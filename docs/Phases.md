# Ajaia Docs — Implementation Phases

Phased delivery plan. **Each phase requires stakeholder approval before implementation begins.**

Estimated effort assumes one developer with AI assistance; adjust if pairing or stricter testing is required.

---

## Global Gate — Import-First (every phase)

**No phase starts coding until:**

1. Web research is done for that phase's deliverables (crawl docs, shadcn, GitHub, UI sites).
2. Candidate sources are listed in **`Sources.md`** (with URLs).
3. Stakeholder approves sources if non-standard or ambiguous.

**No phase is complete until:**

- [ ] All imports logged in **`Sources.md`**
- [ ] No scratch-built UI/editor/auth (see **`ImportFirst.md`**)
- [ ] **Visual QA passed** — UI looks like a real product, not a mock (`Design.md` §1.1, §14)

---

## Phase 0 — Project Foundation

**Goal:** Runnable skeleton with auth, database, and empty shell UI.

### Pre-work (import research)
- Crawl and confirm: `create-next-app`, shadcn Next install, NextAuth Credentials example, Prisma PostgreSQL quickstart, shadcn login block
- Log chosen URLs in **`Sources.md`**

### Deliverables
- Next.js 15 + TypeScript + Tailwind + shadcn/ui — **from official CLI/templates** (not manual setup)
- Prisma schema (User, Document, DocumentShare) — **adapt Prisma docs patterns**
- PostgreSQL connection + migrations
- Seed script: 2–3 demo users (Alice, Bob, Charlie)
- NextAuth Credentials login page — **from Auth.js official example + shadcn login UI**
- Protected `/dashboard` route (empty state) — **shadcn layout/block**
- `.env.example`, README setup section
- ESLint + TypeScript strict

### Exit criteria
- [ ] `npm run dev` works locally
- [ ] Login with seeded user redirects to dashboard
- [ ] Unauthenticated users redirected to `/login`
- [ ] Database tables created via migrate

**Estimate:** 0.5–1 day

---

## Phase 1 — Document CRUD + Rich Text Editor

**Goal:** Core editing loop without sharing or import.

### Pre-work (import research)
- TipTap React "default" / "simple editor" / menus examples
- shadcn button group or toggle pattern for toolbar
- Debounce auto-save pattern from TipTap or React docs
- Log URLs in **`Sources.md`**

### Deliverables
- TipTap editor with toolbar — **imported from TipTap examples**, then extended (bold, italic, underline, H1/H2, lists)
- `POST /api/documents` — create
- `GET/PATCH /api/documents/[id]` — load/update content + title
- `/doc/[id]` page with editor + editable title
- Debounced auto-save + save indicator
- Basic dashboard: list owned documents only, "New document" button, open doc

### Exit criteria
- [ ] Create doc from dashboard → edit → navigate away → reopen with formatting intact
- [ ] Rename title persists
- [ ] Save indicator reflects state
- [ ] Unauthorized user cannot access another user's doc ID

**Estimate:** 1–1.5 days

---

## Phase 2 — Dashboard UX + Persistence Polish

**Goal:** Product-ready document management for owners.

### Deliverables
- Dashboard sections UI structure (owned list complete; placeholder for shared)
- Document cards: title, updated time, owner badge
- Delete document (owner only) with confirmation
- Empty states and loading skeletons
- Error toasts (save failure, load failure)
- `GET /api/documents` — list owned docs

### Exit criteria
- [ ] Dashboard shows all owned docs sorted by `updatedAt`
- [ ] Delete removes doc from list and DB
- [ ] Refresh preserves all documents

**Estimate:** 0.5 day

---

## Phase 3 — File Import

**Goal:** Import files as **new documents** (dashboard) and **into the current document** (editor).

### Pre-work (import research)
- mammoth / marked official usage examples
- shadcn file input + dialog patterns
- TipTap `setContent` / insert content from docs
- Log URLs in **`Sources.md`**

### Deliverables
- Dashboard import button + file picker → **creates new doc**
- Editor "Import" action → **replace or append** into open doc
- `POST /api/documents/import` — multipart, creates new document
- `POST /api/documents/[id]/import` — multipart, merges into existing (replace/append param)
- Parsers: `.txt`, `.md`, `.docx` (mammoth)
- Convert parsed content → TipTap JSON
- UI: accepted formats helper text; error for unsupported types
- Title default from filename (new doc only)

### Exit criteria
- [ ] Dashboard `.txt` / `.md` import creates editable document
- [ ] Editor import replaces or appends content in open doc
- [ ] `.docx` import extracts text (layout not required)
- [ ] Invalid file shows clear error

**Estimate:** 0.5–1 day

---

## Phase 4 — Sharing

**Goal:** Owner shares doc; collaborator sees and accesses per role.

### Deliverables
- Share dialog on editor (email + role: Editor/Viewer)
- `POST /api/documents/[id]/share`
- Permission helpers: `canRead`, `canWrite`, `canShare`, `canDelete`
- Dashboard **Shared with me** section
- Visual distinction: "Owned" vs "Shared" badges
- Viewer role: read-only editor (toolbar disabled)
- List shared docs in `GET /api/documents`

### Exit criteria
- [ ] Alice shares with Bob as Editor → Bob sees doc under Shared with me
- [ ] Bob can edit and save
- [ ] Viewer role cannot edit (toolbar disabled + API rejects PATCH)
- [ ] Non-shared user gets 403/404 on direct URL

**Estimate:** 1 day

---

## Phase 5 — Testing, Deployment & Reviewer Docs

**Goal:** Production-quality delivery for evaluation.

### Deliverables
- Playwright E2E: login → create → format text → save → reload asserts content
- OR Vitest: permissions matrix tests + one API integration test
- Vercel deployment + production Postgres (Neon/Supabase)
- Production seed or migration note for demo accounts
- `ARCHITECTURE_NOTE.md` — priorities and tradeoffs (1 page)
- `AI_WORKFLOW.md` — tools used, verified, rejected
- README: setup, env, deploy URL, demo credentials, supported import types

### Exit criteria
- [ ] Test passes in CI or documented local command
- [ ] Public URL accessible to reviewers
- [ ] All PRD acceptance criteria met
- [ ] No critical console errors on happy path

**Estimate:** 0.5–1 day

---

## Phase Summary

| Phase | Focus | Cumulative capability |
|-------|--------|------------------------|
| 0 | Foundation | Login + DB |
| 1 | Editor | Create, edit, save, reopen |
| 2 | Dashboard | Manage owned docs |
| 3 | Import | File → document |
| 4 | Sharing | Multi-user access |
| 5 | Quality | Tests + deploy + docs |

**Total estimate:** 4–6 days (timebox-friendly MVP)

---

## Optional Phase 6 (only if time permits — NOT in MVP commit)

- Keyboard shortcuts cheat sheet
- Document search/filter on dashboard
- Import into existing document
- Attachment storage (S3/Vercel Blob)
- Dark mode toggle (Design tokens already support it)

**Do not start Phase 6 without explicit approval.**

---

## Approval Checklist (before coding)

Stakeholder confirms:

- [x] PRD scope and non-goals
- [x] Tech stack in Architecture.md
- [x] Design direction in Design.md
- [x] **Import-first rule (`ImportFirst.md`) — no scratch building**
- [x] Phase order and stopping point (Phase 5 = MVP complete)
- [x] Product decisions in **`Decisions.md`** (auth, sharing, import, design, DB)

**Sign-off:** Stakeholder approved September 2, 2026

**Next action:** Explicit go-ahead to begin **Phase 0** (web research → imports → scaffold)
