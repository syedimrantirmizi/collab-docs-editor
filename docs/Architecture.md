# Ajaia Docs — Architecture

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client (Browser)                         │
│  Next.js App Router · React · TipTap Editor · Tailwind/shadcn   │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS (REST / Server Actions)
┌────────────────────────────▼────────────────────────────────────┐
│                    Next.js Server (Node.js)                      │
│  Route Handlers · Server Actions · Auth middleware · Validation │
└────────────┬───────────────────────────────┬────────────────────┘
             │                               │
    ┌────────▼────────┐             ┌───────▼────────┐
    │   PostgreSQL    │             │  File parsing  │
    │  (Supabase or   │             │  (mammoth,     │
    │   Neon + Prisma)│             │   marked)      │
    └─────────────────┘             └────────────────┘
```

**Pattern:** Monolithic Next.js full-stack app with server-side authorization on every document operation. No separate API service for MVP.

**Build pattern (MANDATORY):** **Import-first** — scaffold and UI come from official templates, shadcn, TipTap examples, and documented starters; only product-specific permission and API glue is custom. See **`ImportFirst.md`** and **`Sources.md`**.

---

## 2. Development Model — Import First

We do **not** implement features from blank files. Each layer is assembled from verified web sources:

```
Web research → Select source → Import (CLI/copy) → Adapt to Ajaia → Document in Sources.md
```

| Layer | Import from (not build) |
|-------|-------------------------|
| App shell | `create-next-app`, Next.js examples |
| UI | shadcn/ui + blocks (`button`, `card`, `dialog`, `input`, …) |
| Editor | TipTap official React examples + extensions |
| Auth | Auth.js Credentials guide + middleware example |
| Database | Prisma init + docs schema patterns |
| File parse | `mammoth`, `marked` official usage snippets |
| Tests | Playwright / Vitest official Next.js setup |
| Deploy | Vercel + Prisma deploy docs |

**Custom-written (only):** `lib/permissions.ts`, Zod validators, API route wiring, seed script.

---

## 3. Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | **Next.js 15** (App Router) | User requirement; SSR, API routes, Vercel deploy |
| Language | **TypeScript** | Type safety across UI, API, DB |
| Styling | **Tailwind CSS** + **shadcn/ui** | Fast, consistent UI; accessible primitives |
| Rich text | **TipTap** (+ StarterKit, Underline, Placeholder) | Proven React editor; JSON document model persists formatting |
| Auth | **NextAuth.js v5 (Auth.js)** with Credentials provider | Simple seeded users; session in JWT; no OAuth setup overhead |
| ORM | **Prisma** | Migrations, type-safe queries, good DX |
| Database | **PostgreSQL** — **local for dev**; Neon/Supabase at deploy (Phase 5) | Relational fit; Docker Compose for local reviewer setup |
| Validation | **Zod** | Shared schemas for API and forms |
| File import | **mammoth** (.docx), **marked** (.md) | Lightweight server-side parsing |
| Testing | **Vitest** + **Playwright** (one E2E) | Fast unit/integration; meaningful user flow test |
| Deployment | **Vercel** + hosted Postgres | Zero-config Next deploy; env-based DB URL |

### Alternatives considered

| Option | Why not (for MVP) |
|--------|-------------------|
| SQLite | Simpler locally but weaker for Vercel serverless + sharing demo |
| Lexical | Viable; TipTap chosen for faster toolbar/extensions setup |
| Supabase Auth | Heavier; seeded credentials sufficient for exercise |
| Real-time (Yjs/Liveblocks) | Out of scope; adds complexity |

---

## 4. Data Model

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String   // bcrypt hash — demo only
  documents Document[] @relation("OwnedDocuments")
  shares    DocumentShare[]
  createdAt DateTime @default(now())
}

model Document {
  id        String   @id @default(cuid())
  title     String   @default("Untitled document")
  content   Json     // TipTap JSON
  ownerId   String
  owner     User     @relation("OwnedDocuments", fields: [ownerId], references: [id])
  shares    DocumentShare[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model DocumentShare {
  id         String   @id @default(cuid())
  documentId String
  document   Document @relation(fields: [documentId], references: [id], onDelete: Cascade)
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  role       ShareRole @default(EDITOR)
  createdAt  DateTime @default(now())

  @@unique([documentId, userId])
}

enum ShareRole {
  VIEWER
  EDITOR
}
```

**Content storage:** TipTap JSON in `content` column preserves bold, lists, headings reliably vs raw HTML alone.

---

## 5. Authorization Model

Every document route checks access in this order:

1. **Owner** → full read/write/share/rename/delete
2. **Share EDITOR** → read/write (no share management, no delete)
3. **Share VIEWER** → read-only
4. **Else** → 403

```typescript
// Pseudocode
function canRead(userId, doc) {
  return doc.ownerId === userId || doc.shares.some(s => s.userId === userId);
}
function canWrite(userId, doc) {
  return doc.ownerId === userId || doc.shares.some(s => s.userId === userId && s.role === 'EDITOR');
}
```

Middleware protects `/dashboard`, `/doc/*`. API returns structured errors `{ error, code }`.

---

## 5. Application Flow

### Routes

| Route | Purpose |
|-------|---------|
| `/` | Redirect to `/dashboard` or `/login` |
| `/login` | Demo account login |
| `/dashboard` | My documents + Shared with me + New + Import |
| `/doc/[id]` | Editor view |
| `/api/auth/[...]` | NextAuth handlers |
| `/api/documents/*` | CRUD, share endpoints (or Server Actions) |

### Save strategy

- **Debounced auto-save** (1.5s after last edit) via PATCH `/api/documents/[id]`
- Optimistic UI with rollback on failure
- "Saving…" / "Saved" / "Error — retry" indicator in editor header

### Import pipeline

1. Client uploads file (multipart) to `POST /api/documents/import`
2. Server detects MIME/extension
3. Parse → TipTap-compatible JSON (or HTML → TipTap conversion)
4. Create `Document` row, return `{ id }`
5. Client redirects to `/doc/[id]`

---

## 6. Folder & File Structure

```
ajaia-docs/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts                 # Seeded users + sample docs
├── public/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx            # redirect
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── doc/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts
│   │       └── documents/
│   │           ├── route.ts           # GET list, POST create
│   │           ├── import/route.ts
│   │           └── [id]/
│   │               ├── route.ts       # GET, PATCH, DELETE
│   │               └── share/route.ts
│   ├── components/
│   │   ├── ui/                 # shadcn primitives
│   │   ├── editor/
│   │   │   ├── editor.tsx
│   │   │   ├── toolbar.tsx
│   │   │   └── save-indicator.tsx
│   │   ├── dashboard/
│   │   │   ├── document-list.tsx
│   │   │   ├── import-button.tsx
│   │   │   └── share-dialog.tsx
│   │   └── layout/
│   │       ├── app-header.tsx
│   │       └── user-menu.tsx
│   ├── lib/
│   │   ├── auth.ts             # NextAuth config
│   │   ├── db.ts               # Prisma client
│   │   ├── permissions.ts
│   │   ├── validators.ts       # Zod schemas
│   │   └── import/
│   │       ├── parse-txt.ts
│   │       ├── parse-md.ts
│   │       └── parse-docx.ts
│   └── types/
│       └── index.ts
├── tests/
│   ├── e2e/
│   │   └── document-flow.spec.ts
│   └── unit/
│       └── permissions.test.ts
├── .env.example
├── README.md
├── ImportFirst.md              # Mandatory import-first workflow
├── Sources.md                  # Provenance registry for all imports
├── ARCHITECTURE_NOTE.md        # Short prioritization summary for reviewers
├── AI_WORKFLOW.md              # AI tools, sources found, verification note
├── package.json
├── vitest.config.ts
├── playwright.config.ts
└── next.config.ts
```

---

## 7. API Contract (summary)

### `GET /api/documents`
Returns `{ owned: DocumentSummary[], shared: DocumentSummary[] }` for session user.

### `POST /api/documents`
Body: `{ title?: string }` → creates doc → `{ id, title, ... }`

### `GET /api/documents/[id]`
Returns full document if `canRead`.

### `PATCH /api/documents/[id]`
Body: `{ title?, content? }` — requires `canWrite`.

### `DELETE /api/documents/[id]`
Owner only.

### `POST /api/documents/[id]/share`
Body: `{ email: string, role: 'EDITOR' | 'VIEWER' }` — owner only.

### `POST /api/documents/import`
Multipart `file` → creates document from parsed content.

---

## 8. Deployment Architecture

```
GitHub repo → Vercel (Preview + Production)
                │
                ├── ENV: DATABASE_URL
                ├── ENV: AUTH_SECRET
                └── ENV: NEXTAUTH_URL

Local dev: PostgreSQL via Docker Compose
Production (Phase 5): Neon or Supabase
  └── Prisma migrate deploy on first deploy
```

**Build steps:**
1. `prisma generate`
2. `prisma migrate deploy` (production)
3. `next build`

Seed script run once locally and on demo DB for reviewer accounts.

---

## 9. Prioritization (what we build first)

See `Phases.md` for detail. Architecture priority order:

1. Auth + DB + empty dashboard
2. Editor + save/load (TipTap JSON)
3. Dashboard list + rename
4. Import (.txt, .md first; .docx second)
5. Sharing + permission checks
6. Tests, polish, deploy

**Explicitly deferred:** WebSockets, operational transform, comments, email notifications.

---

## 10. Error Handling Strategy

| Layer | Approach |
|-------|----------|
| API | Zod validation → 400; auth → 401; permission → 403; not found → 404 |
| Client | Toast for user-facing errors; retry on save failure |
| Import | Per-format try/catch; user message names unsupported type |
| DB | Prisma errors logged server-side; generic message to client |

---

## 11. Environment Variables

```env
DATABASE_URL=postgresql://...
AUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
```

---

## 12. Dependencies (core)

```json
{
  "next": "^15",
  "react", "react-dom",
  "@tiptap/react", "@tiptap/starter-kit", "@tiptap/extension-underline",
  "@prisma/client", "prisma",
  "next-auth",
  "zod", "bcryptjs",
  "mammoth", "marked",
  "tailwindcss", "@radix-ui/* (via shadcn)"
}
```
