# LoopC Business Strategies

Monorepo for the **public marketing website**, **SaaS sales / billing portal**, and **Super Admin** — not the ERP product itself.

The LoopC ERP application is a **separate project**. This repo sells and provisions access to it via subscription entitlements and a configurable `ERP_APP_URL`.

| App | Local | Path | Purpose |
|---|---|---|---|
| Marketing | http://localhost:3000 | [`site/`](site/) | Public website (`www.loopcstrategies.com`) |
| Portal + Admin | http://localhost:3001 | [`erp/`](erp/) | Signup, checkout, customer account portal, Super Admin `/admin` |
| Postgres | localhost:5433 | Docker Compose in `erp/` | Portal database |
| External ERP | `ERP_APP_URL` | Separate deploy | Real product customers open after subscribe |

## Architecture

```
www.loopcstrategies.com (site/)  --api/public/*-->  portal (erp/ :3001)  -->  Postgres
        |                                              ^
   pricing / contact                            Super Admin /admin
        |                                         (admin.loopcstrategies.com)
        +---- signup?plan= ---> checkout --> webhook --> Subscription ACTIVE
                                                              |
                                                              v
                                                     ERP_APP_URL (external product)
```

**Separation rule:** This repo sells and manages access to LoopC ERP. It does **not** implement CRM, accounting, inventory, HR, payroll, or other ERP business modules. Those live only in the external ERP application.

Customer `/app` in this repo is an **account / billing portal**, not the ERP product.

## Quick start

```bash
# Portal + database
cd erp
docker compose up -d
cp env.example .env         # AUTH_SECRET, DATABASE_URL, SEED_ADMIN_PASSWORD, ERP_APP_URL
npm install
npx prisma migrate dev
npm run db:seed
npm run db:seed:cms
npm run dev                 # portal on :3001
```

```bash
# Marketing site
cd site
cp env.example .env.local   # ERP_API_URL=http://localhost:3001
npm install
npm run dev                 # site on :3000
```

Admin login: `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in `erp/.env`.

## Key flows

1. **Purchase:** `site/pricing` → portal `/signup` → `/checkout` → Razorpay (or mock) → webhook → ACTIVE → Open ERP (`ERP_APP_URL`)
2. **CMS:** Admin → Website → edits → `site/` via public APIs (~30s revalidate)
3. **Plans:** Admin → Sales → Plans → reflected on `site/pricing`
4. **Enquiries:** Contact form → portal `/api/public/contact` → Admin → Contacts

## Domains

| Host | App |
|---|---|
| `www.loopcstrategies.com` | Marketing (`site/`) |
| Portal `APP_URL` (e.g. signup/checkout host) | Sales + customer account (`erp/`) |
| `admin.loopcstrategies.com` | Super Admin only (same `erp/` deploy; host gate) |
| `ERP_APP_URL` | External LoopC ERP product |

## Environment

- `erp/env.example` — database, auth, `ERP_APP_URL`, Razorpay, CORS, seed
- `site/env.example` — `ERP_API_URL` / `NEXT_PUBLIC_ERP_URL` (portal public API + signup links)
