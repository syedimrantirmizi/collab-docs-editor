# Approved Product Decisions

Locked decisions from stakeholder review. Implementation must follow these unless explicitly changed.

**Approved:** September 2, 2026  
**Also approved:** `ImportFirst.md`, `Sources.md` tracking workflow

---

## Summary

| Area | Decision |
|------|----------|
| **Import-first** | ✅ Mandatory — web crawl → import → adapt (`ImportFirst.md`) |
| **Auth** | Seeded accounts only — no signup |
| **Share roles** | Editor + Viewer |
| **Real-time collab** | Deferred — not in v1 |
| **File import** | New document **and** import into current open document |
| **Design** | Light mode, teal accent, card-based dashboard |
| **Typography** | Sans UI (Inter) + serif editor body |
| **Database** | Local PostgreSQL for now; production DB at deploy time |
| **Branding** | Placeholder wordmark "Ajaia Docs" until assets provided |

---

## 1. Auth — Seeded accounts only

- **No signup / registration** in v1.
- Pre-seeded users in `prisma/seed.ts` (minimum: Alice, Bob).
- Login via **NextAuth Credentials** — email + password.
- Demo credentials documented in README for reviewers.

**Example accounts (to be finalized in seed):**

| Email | Password | Name |
|-------|----------|------|
| `alice@ajaia.test` | `password123` | Alice |
| `bob@ajaia.test` | `password123` | Bob |

---

## 2. Sharing — Editor + Viewer

| Role | Can read | Can edit | Can share | Can delete |
|------|----------|----------|-----------|------------|
| **Owner** | ✅ | ✅ | ✅ | ✅ |
| **Editor** (shared) | ✅ | ✅ | ❌ | ❌ |
| **Viewer** (shared) | ✅ | ❌ | ❌ | ❌ |

- Share dialog: pick seeded user by email + select role.
- Viewer: read-only editor (toolbar disabled + API rejects PATCH).
- Dashboard badges: **Owned** vs **Shared**; show role on shared items.

---

## 3. Real-time collaboration — Deferred

- No WebSockets, Yjs, or live multi-cursor in v1.
- Last-write-wins on save is acceptable for MVP.
- Document as explicit non-goal in README and architecture note.

---

## 4. File import — New doc + import into current

Two entry points:

| Entry | Behavior |
|-------|----------|
| **Dashboard import** | Creates a **new document** from file; title from filename |
| **Editor import** | **Appends or replaces** content in the **currently open** document (UI: "Import into document" with replace vs append choice recommended) |

**Supported types:** `.txt`, `.md`, `.docx` (text extraction only for docx)

**Out of scope:** Binary attachments stored on documents.

---

## 5. Design — Light, teal, cards

- **Light mode only** for MVP (dark mode → optional Phase 6).
- **Primary accent:** teal `#0D9488` (see `Design.md`).
- **Dashboard:** card grid/list — not table.
- **Editor:** centered paper-style surface with sticky header + toolbar.

---

## 6. Typography

- **UI:** Inter (`next/font/google`)
- **Editor content:** Source Serif 4 or Georgia fallback
- See `Design.md` for scale and TipTap element sizes.

---

## 7. Database — Local first

- **Development:** local PostgreSQL (Docker Compose or native install).
- **Connection:** `DATABASE_URL` in `.env`.
- **Deploy (Phase 5):** provision hosted Postgres (Neon or Supabase) — not required until deployment phase.
- Prisma migrations committed to repo.

**Local setup** will be documented in README (Docker Compose recommended for reviewer consistency).

---

## 8. Branding — Placeholder

- Header wordmark: **Ajaia Docs** (text, no logo SVG yet).
- Default favicon (Next.js or simple generated).
- Replace with official Ajaia assets when provided — no blocking dependency.

---

## 9. Still open (non-blocking)

| Item | Default if not provided |
|------|-------------------------|
| Official Ajaia logo / colors | Keep teal + text wordmark |
| Third demo user (Charlie) | Include in seed for share demos |
| Import into current: **replace vs append** | Offer both in UI (replace default, append optional) |

---

## Sign-off checklist

- [x] Import-first (`ImportFirst.md`)
- [x] Sources tracking (`Sources.md`)
- [x] Auth: seeded only
- [x] Share: Editor + Viewer
- [x] Real-time: deferred
- [x] File import: new + into current
- [x] Design: light / teal / cards
- [x] Typography: sans UI + serif editor
- [x] DB: local Postgres first
- [x] Branding: placeholder

**Ready for Phase 0:** ✅ (pending explicit "start Phase 0" from stakeholder)
