# LoopC portal — SaaS sales, billing & Super Admin

This Next.js app is the **sales / subscription / billing portal** and **Super Admin** for LoopC Business Strategies.

It is **not** the LoopC ERP product. The ERP is a separate application opened via `ERP_APP_URL` after a customer has an active subscription.

## Prerequisites

- Node.js 20.9+
- Docker (for local Postgres) or any PostgreSQL 16+

## Setup

```bash
cd erp
cp env.example .env
docker compose up -d
npm install
npx prisma migrate deploy
npm run db:seed
npm run db:seed:cms
npm run dev
```

Portal: http://localhost:3001

Seeded super admin (from `.env`):

- Email: `admin@loopcstrategies.com`
- Password: value of `SEED_ADMIN_PASSWORD`

Demo coupon: `LAUNCH20` (20% off).

## Customer flow

Marketing pricing → Signup → Checkout → Payment (Razorpay or mock) → Webhook activates subscription → account portal `/app` → **Open ERP** (`ERP_APP_URL`)

**Important:** Subscription becomes `ACTIVE` only after webhook confirmation (or `POST /api/checkout/mock-complete` in local/dev when Razorpay keys are empty).

## Admin

Login as super admin → http://localhost:3001/admin  
Production intent: `admin.loopcstrategies.com` (same deploy; host middleware restricts to `/admin`).

## Scripts

- `npm run smoke:billing` — checkout → webhook → ACTIVE
- `npm run e2e:verify` — marketing + portal integration checks
- `npm run verify:saas` — entitlement / tenancy workflow
- `npm run jobs:billing` — trial expiry / grace / scheduled plan changes
