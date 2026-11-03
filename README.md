# BLIEVE Web

Monorepo for the BLIEVE E-Cell, ACE website.

| Folder   | What it is | Deployed on | Deploys from |
|----------|-----------|-------------|--------------|
| `web/`   | Next.js frontend (pages, UI) | Vercel | `web/` via the Vercel project |
| `server/`| Express API backend (auth, forms, admin review console — MongoDB Atlas) | Render | this repo (root directory: `server`) |

## Structure

```
web/
  src/app/        Next.js pages (app router)
  src/components/ UI components
  src/lib/        client-side helpers (session store, api base)
  next.config.ts  frontend env var: NEXT_PUBLIC_API_URL
server/
  src/index.js    Express app (CORS, cookies, health check)
  src/routes/     auth.js (member auth), admin.js (review console), forms.js (apply/contact/newsletter/membership)
  src/lib/        MongoDB layer, session cookies, validation, rate limiting
  .env.example    backend env vars
```

## Data

All submissions (member signups, membership applications, apply/contact/newsletter
forms) are stored in **MongoDB Atlas**. The admin console protects the review
endpoints with an HMAC-signed cookie derived from `ADMIN_PASSWORD`.

## Environment variables

Frontend (Vercel): `NEXT_PUBLIC_API_URL` (e.g. `https://blieve-api.onrender.com`),
`NEXT_PUBLIC_SITE_URL`. See `web/.env.example` if present / Vercel settings.

Backend (Render): `MONGODB_URI`, `SESSION_SECRET`, `ADMIN_PASSWORD`, `ADMIN_NAME`,
`ADMIN_EMAIL`, `CORS_ORIGINS`. See `server/.env.example`.

## Local development

```bash
# terminal 1 — backend (http://localhost:4000)
cd server
npm install
copy .env.example .env   # fill in MONGODB_URI + secrets
npm run dev

# terminal 2 — frontend (http://localhost:3000)
cd web
npm install
# web/.env.local sets NEXT_PUBLIC_API_URL=http://localhost:4000
npm run dev
```

## Endpoints

- `GET /health` — service health
- `POST /api/auth/register` · `POST /api/auth/login` · `POST /api/auth/logout` · `GET /api/auth/session` · `GET /api/auth/my-applications`
- `POST /api/apply` · `POST /api/contact` · `POST /api/newsletter` · `POST /api/membership`
- `POST /api/admin/login` · `POST /api/admin/logout` · `GET /api/admin/applications` · `GET|PATCH /api/admin/applications/:id`
