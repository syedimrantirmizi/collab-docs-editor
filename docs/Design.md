# Ajaia Docs — Design System & Theming

Visual and UX direction for the collaborative document editor. Professional, calm, and documentation-focused — inspired by modern productivity tools without copying Google Docs branding.

---

## 1. Design Principles

1. **Content first** — chrome stays minimal; editor is the hero.
2. **Calm density** — readable spacing; not cramped like a spreadsheet, not airy like a marketing site.
3. **Obvious ownership** — owned vs shared docs visually distinct at a glance.
4. **Trust through state** — save status, errors, and permissions always visible.

---

## 2. Brand Direction (Ajaia)

Until official brand assets are provided, use a **neutral professional** palette with a single accent color suggesting clarity and focus (teal-blue). Replace with Ajaia brand tokens when available.

---

## 3. Color Palette

### Light mode (default)

| Token | Hex | Usage |
|-------|-----|--------|
| `--background` | `#FAFAFA` | App background |
| `--surface` | `#FFFFFF` | Cards, editor canvas, modals |
| `--foreground` | `#171717` | Primary text |
| `--muted-foreground` | `#737373` | Secondary text, timestamps |
| `--border` | `#E5E5E5` | Dividers, card borders |
| `--primary` | `#0D9488` | Primary buttons, links, focus ring (teal-600) |
| `--primary-foreground` | `#FFFFFF` | Text on primary |
| `--secondary` | `#F4F4F5` | Secondary buttons, toolbar bg |
| `--accent` | `#CCFBF1` | Hover highlights (teal-100) |
| `--destructive` | `#DC2626` | Delete actions |
| `--success` | `#16A34A` | Saved indicator |
| `--warning` | `#CA8A04` | Saving / pending |

### Semantic badges

| Badge | Background | Text | Use |
|-------|------------|------|-----|
| Owned | `#E0F2FE` | `#0369A1` | User owns document |
| Shared | `#F3E8FF` | `#7C3AED` | Shared with user |
| Viewer | `#FEF3C7` | `#B45309` | Read-only access |

### Dark mode (optional Phase 6)

| Token | Hex |
|-------|-----|
| `--background` | `#0A0A0A` |
| `--surface` | `#171717` |
| `--foreground` | `#FAFAFA` |
| `--primary` | `#2DD4BF` |

Implement via CSS variables + `class="dark"` on `<html>` when approved.

---

## 4. Typography

### Font stack

| Role | Font | Fallback |
|------|------|----------|
| **UI** | `Inter` | `system-ui, sans-serif` |
| **Editor content** | `Source Serif 4` or `Georgia` | `serif` |

**Rationale:** Sans for UI feels modern; serif in editor improves long-form reading (Docs-like without copying Product Sans).

Load via `next/font/google` for performance.

### Scale

| Name | Size | Line height | Weight | Use |
|------|------|-------------|--------|-----|
| `display` | 30px | 36px | 600 | Dashboard page title |
| `h1` | 24px | 32px | 600 | Document title in editor |
| `h2` | 20px | 28px | 600 | Section headers |
| `body` | 16px | 24px | 400 | Default UI text |
| `small` | 14px | 20px | 400 | Metadata, badges |
| `xs` | 12px | 16px | 500 | Save status, captions |

### Editor content sizes (TipTap)

| Element | Size |
|---------|------|
| Paragraph | 16px / 1.75 line-height |
| H1 | 28px / bold |
| H2 | 22px / semibold |
| Lists | 16px, indent 1.5rem |

---

## 5. Spacing & Layout

**Base unit:** 4px grid

| Token | Value |
|-------|-------|
| `space-1` | 4px |
| `space-2` | 8px |
| `space-3` | 12px |
| `space-4` | 16px |
| `space-6` | 24px |
| `space-8` | 32px |

### Layout widths

| Area | Max width |
|------|-----------|
| Dashboard content | 960px centered |
| Editor paper | 816px (≈ letter width) centered |
| App header | full width, inner max 1200px |

### Editor page structure

```
┌──────────────────────────────────────────────────────────┐
│  Header: logo · doc title · save status · share · user   │
├──────────────────────────────────────────────────────────┤
│  Toolbar: B I U · H1 H2 · • 1.                           │
├──────────────────────────────────────────────────────────┤
│              ┌─────────────────────────┐                 │
│              │   Editor surface        │                 │
│              │   (white card, shadow)  │                 │
│              └─────────────────────────┘                 │
└──────────────────────────────────────────────────────────┘
```

---

## 6. Components

### shadcn/ui components to install (via CLI — not hand-built)

- `button`, `input`, `label`, `card`, `dialog`, `dropdown-menu`
- `toast` / `sonner`, `badge`, `separator`, `skeleton`, `avatar`

Prefer **[shadcn blocks](https://ui.shadcn.com/blocks)** for dashboard, login, and empty states before composing custom layouts.

### Adapted components (import base, then edit — see `ImportFirst.md`)

| Component | Import base from | Adaptations |
|-----------|------------------|-------------|
| `EditorToolbar` | TipTap menus example + shadcn `Toggle` / `Button` | Wire to our editor instance; theme per Design.md |
| `DocumentCard` | shadcn `Card` block or dashboard block | Add badge, relative time |
| `ShareDialog` | shadcn `Dialog` + `Combobox` examples | Seeded user list, role select |
| `SaveIndicator` | shadcn badge/text pattern from docs | Saving / Saved / Error copy |
| `ImportButton` | shadcn file input / button pattern | Accept attribute, format hint |

### Button hierarchy

- **Primary:** New document, Share confirm, Login
- **Secondary:** Import, Cancel
- **Ghost:** Toolbar formatting, back navigation
- **Destructive:** Delete document

---

## 7. Motion

Keep motion minimal for MVP:

- Dialog: fade + scale (shadcn default)
- Save indicator: subtle opacity transition 150ms
- List items: hover background 100ms

No page transitions required in v1.

---

## 8. Iconography

Use **Lucide React** (shadcn default):

- Bold `Bold`, Italic `Italic`, Underline `Underline`
- Lists `List`, `ListOrdered`
- Share `Share2`, Import `Upload`, New `FilePlus`
- Delete `Trash2`

Icon size: 16px toolbar, 20px nav actions.

---

## 9. Key Screens

### Login
- Centered card on `--background`
- Product name + short tagline
- Email/password fields
- Hint: "Demo: alice@ajaia.test / password"

### Dashboard
- Page title: "Documents"
- Actions row: **New document** (primary), **Import** (secondary)
- Section: **My documents** — grid or list of cards
- Section: **Shared with me** — same card style + Shared badge
- Empty state illustration text: "No documents yet. Create one or import a file."

### Editor
- Sticky header + toolbar
- Read-only banner for Viewer role (amber subtle bar)
- Editor card with soft shadow: `0 1px 3px rgba(0,0,0,0.08)`

---

## 10. Tailwind / CSS Variables Setup

```css
/* globals.css excerpt */
:root {
  --background: 0 0% 98%;
  --foreground: 0 0% 9%;
  --primary: 173 80% 32%;
  --primary-foreground: 0 0% 100%;
  --border: 0 0% 90%;
  --radius: 0.5rem;
}
```

Map to shadcn theme in `tailwind.config.ts`.

---

## 11. Accessibility

- Contrast ratio ≥ 4.5:1 for body text on surfaces
- Toolbar: `aria-pressed` for toggle buttons
- Share dialog: focus trap, `aria-labelledby`
- Viewer banner: `role="status"`

---

## 12. Assets Needed (optional)

- [ ] Ajaia logo SVG (header)
- [ ] Favicon
- [ ] Official brand colors (replace teal accent)

Placeholder until provided: text wordmark **Ajaia Docs** in `display` style.

---

## 13. Design Approval

Approved September 2, 2026 (see **`Decisions.md`**):

- [x] Light-only for MVP (dark mode → optional Phase 6)
- [x] Teal accent `#0D9488`
- [x] Serif editor / sans UI (Inter + Source Serif 4)
- [x] Card-based dashboard

**Sign-off:** Approved
