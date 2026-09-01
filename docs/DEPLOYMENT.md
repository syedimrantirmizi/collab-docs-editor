# Deployment Guide

Production deployment uses a **neutral GitHub repository name**, **Vercel** for the Next.js app, and **Neon** for PostgreSQL. Run tests **before** pushing and deploying.

---

## Order of operations

1. Local tests pass (`npm run test`, `npm run test:e2e`)
2. Create GitHub repo (neutral name)
3. Push code to `main`
4. Create Neon Postgres project
5. Import repo in Vercel + configure env vars
6. Deploy (migrations run automatically via `vercel.json`)
7. Seed demo users **once** on production
8. Smoke-test the public URL

---

## 1. Recommended GitHub repository name

Use a **generic, non-client** repo slug so the public GitHub URL does not reference Ajaia.

| Suggested name | Example URL |
|----------------|-------------|
| **`collab-docs-editor`** (recommended) | `github.com/syedimrantirmizi/collab-docs-editor` |
| `rich-text-workspace` | `github.com/YOUR_USER/rich-text-workspace` |
| `team-docs-mvp` | `github.com/YOUR_USER/team-docs-mvp` |

The in-app wordmark can still say “Ajaia Docs” — only the **GitHub repo name** stays neutral.

### Create and push (after tests pass)

```bash
# From project root — replace YOUR_USER and REPO_NAME
git checkout -b main
git add .
git commit -m "MVP: collaborative docs editor with auth, import, and sharing"

gh repo create collab-docs-editor --public --source=. --remote=origin --push
# Or create the empty repo on github.com first, then:
# git remote add origin https://github.com/YOUR_USER/collab-docs-editor.git
# git push -u origin main
```

---

## 2. Neon Postgres (production database)

1. Sign in at [https://neon.tech](https://neon.tech)
2. **New project** → choose a region close to your Vercel deployment (e.g. `Washington, D.C.` for `iad1`)
3. Copy the **pooled** connection string (`?sslmode=require`)
4. Database name can stay default; no manual schema setup — Prisma migrations handle it

Example shape:

```text
postgresql://USER:PASSWORD@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
```

---

## 3. Vercel project

1. [https://vercel.com/new](https://vercel.com/new) → **Import** your GitHub repo
2. Framework preset: **Next.js** (auto-detected)
3. Build command is set in `vercel.json`:

   ```json
   "buildCommand": "prisma migrate deploy && next build"
   ```

4. Add **Environment Variables** (Production + Preview):

   | Variable | Value |
   |----------|--------|
   | `DATABASE_URL` | Neon pooled connection string |
   | `AUTH_SECRET` | `openssl rand -hex 32` (generate a new one) |
   | `AUTH_URL` | `https://YOUR-PROJECT.vercel.app` (no trailing slash) |

5. **Deploy**

After the first successful deploy, note the production URL and update `AUTH_URL` if the default domain differs, then redeploy once.

---

## 4. Seed demo users (one time)

Migrations run on every Vercel build. **Seed does not** — run it once against production:

```bash
# Install Vercel CLI if needed: npm i -g vercel
vercel env pull .env.production.local   # optional: pull prod env locally

DATABASE_URL="YOUR_NEON_URL" \
AUTH_SECRET="YOUR_AUTH_SECRET" \
npm run db:seed
```

Or use Neon SQL editor / local machine with production `DATABASE_URL` set.

Demo accounts (same as local):

| Email | Password |
|-------|----------|
| `alice@ajaia.test` | `password123` |
| `bob@ajaia.test` | `password123` |
| `charlie@ajaia.test` | `password123` |

---

## 5. Post-deploy smoke test

- [x] `https://collab-docs-editor.vercel.app/login` loads
- [x] Login as Alice → dashboard
- [x] New document → type → “Saved” indicator
- [x] Import `.txt` from dashboard
- [x] Share with Bob → log in as Bob → doc under “Shared with me”
- [x] No console errors on happy path

---

## 6. CI (GitHub Actions)

`.github/workflows/ci.yml` runs on push/PR:

- `npm run test` (Vitest permissions)
- `npm run test:e2e` (Playwright) with Postgres service container

Enable by pushing to GitHub after the repo is created.

---

## Environment reference

See `.env.example` for local vs production variable notes.

**Local**

```env
DATABASE_URL="postgresql://ajaia:ajaia@localhost:5432/ajaia_docs"
AUTH_SECRET="..."
AUTH_URL="http://localhost:3000"
```

**Production (Vercel)**

```env
DATABASE_URL="postgresql://...neon.tech/...?sslmode=require"
AUTH_SECRET="..."
AUTH_URL="https://YOUR-PROJECT.vercel.app"
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails on `migrate deploy` | Check `DATABASE_URL` on Vercel; Neon project must be reachable |
| Login loops / session errors | `AUTH_URL` must exactly match the public site URL |
| Empty dashboard after login | Run `npm run db:seed` against production DB |
| E2E fails locally | Ensure Postgres is up, `npm run db:migrate && npm run db:seed` |

---

## Updating README after deploy

Add your live URL to the root **`README.md`** under a **Production** section:

```markdown
## Production

- **URL:** https://collab-docs-editor.vercel.app
- **Repo:** https://github.com/syedimrantirmizi/collab-docs-editor
```
