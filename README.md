# LoopC website

Monorepo for LoopC Business Strategies — premium public website, ERP sales admin, and the existing ERP product.

| App | URL | Path | Purpose |
|---|---|---|---|
| Marketing | http://localhost:3000 | [`site/`](site/) | Public website (Home, About, Services, ERP, Pricing, Contact, FAQ, Blog) |
| ERP SaaS + Admin | http://localhost:3001 | [`erp/`](erp/) | ERP product, signup/checkout, Super Admin `/admin`, billing APIs |
| Postgres | localhost:5433 | Docker Compose in `erp/` | Shared database |

## Architecture

```
Marketing site (:3000)  ---api/public/*--->  ERP app (:3001)  --->  Postgres (:5433)
                                                   ^
                                            Super Admin /admin
                                            controls CMS + billing
                         ---/signup?plan=---> Signup/Checkout (/checkout, /webhooks)
                                                   |
                                                   v
                                            Subscription ACTIVE
                                                   |
                                                   v
                                            Existing ERP /app (untouched)
```

**Separation rule:** The public website and Admin Panel sell and manage access to the ERP. They do not implement CRM, accounting, inventory, HR, payroll or other ERP business modules. Those live only in `erp/src/app/(app)/`.

## Quick start

```bash
# Start the database
cd erp
docker compose up -d
cp env.example .env         # fill in AUTH_SECRET, DATABASE_URL, SEED_ADMIN_PASSWORD

npm install
npx prisma migrate dev
npm run db:seed             # seed admin user and plans
npm run db:seed:cms         # seed website content (hero, services, FAQs, etc.)
npm run dev                 # ERP on :3001
```

```bash
# Marketing site (second terminal)
cd site
cp .env.example .env.local  # set ERP_API_URL=http://localhost:3001
npm install
npm run dev                 # site on :3000
```

Admin login credentials come from `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in `erp/.env`.

## Key flows

1. **Customer purchase:** `site/pricing` → choose plan → `erp/signup` → checkout → Razorpay → webhook → ACTIVE subscription → `/app` (existing ERP)
2. **Content management:** Admin → Website CMS → edit hero/services/FAQ → appears on `site/` immediately (30s revalidation)
3. **Plan management:** Admin → ERP Sales → Plans → change prices/features → reflected on `site/pricing` from DB
4. **Enquiries:** Contact form → `erp/api/public/contact` → Admin → Website → Contact Enquiries → status workflow

## Admin panel

`/admin` (requires `isSuperAdmin = true` on the user account)

| Section | Routes |
|---|---|
| Dashboard | `/admin` |
| Website | `/admin/website` (Home, About, ERP Product, Services, FAQs, Testimonials, Contact Enquiries, SEO, Media Library, Blog) |
| ERP Sales | `/admin/plans`, `/admin/companies`, `/admin/subscriptions`, `/admin/payments`, `/admin/invoices`, `/admin/coupons` |
| Operations | `/admin/analytics`, `/admin/settings`, `/admin/audit` |

## Deployment

| App | Recommended host | Domain example |
|---|---|---|
| `site/` | Vercel / Railway | `www.loopcstrategies.com` |
| `erp/` | Railway | `app.loopcstrategies.com` |

Set `ERP_API_URL` and `NEXT_PUBLIC_ERP_URL` in `site/` to point to the production ERP domain.
Set `MARKETING_URL` in `erp/.env` to the production marketing domain for CORS.

## Environment variables

- `erp/env.example` — ERP app (database, auth, Razorpay, storage, CORS)
- `site/.env.example` — Marketing site (ERP API URL, Turnstile)
