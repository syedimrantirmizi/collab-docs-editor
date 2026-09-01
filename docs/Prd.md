# Ajaia Collaborative Document Editor — Product Requirements Document (PRD)

## 1. Overview

**Product name (working):** Ajaia Docs  
**Type:** Lightweight collaborative document editor (Google Docs–inspired)  
**Purpose:** Internal productivity tool for teams to create, edit, import, share, and persist rich-text documents in the browser.

This is **not** a Google Docs clone. The goal is a **strong, shippable MVP** that demonstrates product judgment, full-stack capability, and clear prioritization within a timebox.

---

## 2. Problem Statement

Teams need a simple place to draft and share documents without heavy setup. Existing tools are powerful but complex; this product focuses on the **core loop**: create → edit → save → share → reopen.

---

## 3. Target Users

| Persona | Description | Primary needs |
|--------|-------------|---------------|
| **Document owner** | Creates and owns documents | Fast creation, reliable save, rename, import from files, share with teammates |
| **Collaborator** | Receives shared access | Find shared docs, open and edit (or view, if scoped), distinguish owned vs shared |
| **Reviewer / evaluator** | Assesses the build | Clear setup, working deployment, coherent UX, visible sharing behavior |

**Scope assumption:** Small internal team (5–50 users). No enterprise SSO, no real-time multi-cursor collaboration in v1.

---

## 4. Goals & Success Criteria

### Product goals
- Users can complete the document lifecycle in one session: create, edit with formatting, save, close, reopen.
- Users can import content from at least one file type into the editor workflow.
- Users can share a document with another user; shared access persists and is visible in the UI.
- Owned vs shared documents are clearly distinguished.

### Engineering goals
- Data survives refresh and redeploy (persistent storage).
- Rich-text structure is preserved on save/reopen.
- Deployed demo URL for reviewers.
- At least one meaningful automated test.
- Clear README with setup and run instructions.

### Non-goals (v1)
- Real-time collaborative editing (multiple cursors, live presence)
- Comments, suggestions, version history
- Offline mode
- Mobile-native apps
- Enterprise permissions (roles beyond owner / editor / viewer if any)
- Full .docx fidelity (layout, images, complex styles)
- Search across all org documents
- Notifications / email invites

---

## 5. Core Features

### 5.1 Document creation and editing

| Capability | Requirement | Priority |
|-----------|-------------|----------|
| Create document | New doc from dashboard with default title (e.g. "Untitled document") | P0 |
| Rename document | Inline or modal rename; persisted | P0 |
| Edit in browser | Rich-text editor with toolbar | P0 |
| Save | Auto-save (debounced) + explicit save indicator | P0 |
| Reopen | Document list → click → load content + formatting | P0 |

**Rich-text formatting (minimum):**

- Bold, italic, underline
- Headings or text size variation (H1, H2, body)
- Bulleted list, numbered list

**UX expectations:**
- Toolbar reflects current selection state
- Empty state on new document is helpful, not blank confusion
- Unsaved / saving / saved states visible

### 5.2 File upload

**Approved v1 behavior:** Two import paths (see `Decisions.md`).

| Entry point | Behavior |
|-------------|----------|
| **Dashboard** | Upload creates a **new document**; title from filename |
| **Editor** | **Import into current document** — replace or append parsed content |

| Supported types | Behavior |
|----------------|----------|
| `.txt` | Plain text → paragraphs in editor |
| `.md` | Markdown → converted for editor (headings, lists, emphasis) |
| `.docx` | Text/content extraction via library (mammoth); layout not preserved |

**UI requirements:**
- Dashboard: import button with accepted formats listed
- Editor: "Import" action with replace vs append choice (replace as default)
- Clear error if unsupported type or parse failure
- Success → new doc navigates to editor; in-doc import updates current draft

**Out of scope v1:** Binary attachments stored on documents.

### 5.3 Sharing

| Requirement | Detail |
|-------------|--------|
| Document owner | User who created the document (or imported it) |
| Grant access | Owner invites another user by email or username (seeded accounts) |
| Access levels (v1) | **Editor** (can edit) and **Viewer** (read-only) — minimum: editor |
| Visibility | Dashboard sections: **My documents** / **Shared with me** |
| Persistence | Share records stored in DB; survive refresh |

**Auth approach (v1):** Lightweight login with **seeded demo accounts** (e.g. `alice@ajaia.test`, `bob@ajaia.test`) to avoid signup friction for reviewers.

### 5.4 Persistence

- Documents: id, title, content (JSON or HTML), ownerId, timestamps
- Shares: documentId, userId, role, createdAt
- Formatting preserved via editor document model (TipTap JSON recommended)
- All CRUD and share operations via API with validation

---

## 6. User Flows

### Flow A — Create and edit
1. User logs in → lands on dashboard
2. Clicks "New document" → editor opens with untitled doc
3. Types content, applies formatting via toolbar
4. Auto-save persists; user sees "Saved"
5. User navigates back → document appears under "My documents"
6. User reopens → formatting intact

### Flow B — Import file
1. User clicks "Import" on dashboard
2. Selects `.md` / `.txt` / `.docx`
3. System creates document; title from filename (editable)
4. User lands in editor with imported content

### Flow C — Share document
1. Owner opens document → clicks "Share"
2. Enters collaborator email (seeded user) and role
3. Collaborator logs in → sees doc under "Shared with me"
4. Collaborator opens and edits (if editor role)

### Flow D — Rename
1. Owner clicks title in editor or dashboard action
2. Enters new name → saved immediately

---

## 7. Functional Requirements Summary

| ID | Requirement |
|----|-------------|
| FR-01 | Authenticated users can create documents |
| FR-02 | Users can rename owned documents |
| FR-03 | Rich-text editor supports bold, italic, underline, headings, bullet/numbered lists |
| FR-04 | Documents auto-save and reload with formatting |
| FR-05 | Users can import .txt, .md, or .docx as new documents |
| FR-06 | Unsupported uploads show clear UI error |
| FR-07 | Owner can share document with another user |
| FR-08 | Dashboard distinguishes owned vs shared documents |
| FR-09 | Shared users can access document per granted role |
| FR-10 | All data persists across sessions |

---

## 8. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| Performance | Editor interactive within 200ms; save debounce ~1–2s |
| Security | Users cannot access others' private docs; share checks on every read/write |
| Accessibility | Semantic headings in editor; keyboard toolbar shortcuts where feasible |
| Browser support | Latest Chrome, Firefox, Safari, Edge |
| Deployment | Public demo URL (Vercel + managed DB) |
| Testing | ≥1 integration or E2E test covering create → save → reload |
| **Import-first (MUST)** | No scratch-built UI/editor/auth; web research → import → adapt; log sources in `Sources.md` (see `ImportFirst.md`) |
| **Visual quality (MUST)** | Product-grade, beautiful UI — polished surfaces, hierarchy, empty states; not mock/wireframe (`Design.md` §1.1) |

---

## 9. Acceptance Criteria (MVP)

- [ ] Reviewer can log in with seeded account
- [ ] Reviewer can create, rename, format, save, and reopen a document
- [ ] Reviewer can import at least `.txt` and `.md` successfully
- [ ] Reviewer can share with second seeded account; second user sees doc in "Shared with me"
- [ ] Refresh does not lose documents or shares
- [ ] README explains setup, env vars, and deployment
- [ ] One automated test passes in CI or locally
- [ ] Architecture / AI workflow notes included
- [ ] `Sources.md` documents imported components and templates (import-first compliance)
- [ ] UI looks like a **shippable product** (not a mock) per `Design.md` Visual QA

---

## 10. Approved Decisions

All former open questions are **resolved**. See **`Decisions.md`** for the full record.

| Topic | Approved choice |
|-------|-----------------|
| Auth | Seeded accounts only (no signup) |
| Share roles | Editor + Viewer |
| Real-time | Deferred — not in v1 |
| File import | New document **and** import into current open document |
| Design | Light mode, teal accent, card dashboard |
| Typography | Sans UI (Inter) + serif editor |
| **Visual quality** | Product-grade, beautiful UI — not mock/wireframe |
| Database | Local PostgreSQL now; hosted DB at deploy (Phase 5) |
| Branding | Placeholder "Ajaia Docs" wordmark |

---

## 11. Metrics (lightweight, post-MVP)

- Documents created per session
- Share actions completed
- Import success vs failure rate
- Time to first saved document

Not required for exercise delivery; included for product thinking.
