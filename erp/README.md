# LoopC ERP — SaaS subscription & billing

Multi-tenant ERP shell with DB-driven plans, Razorpay (or mock) checkout, webhook-confirmed subscriptions, feature gating, customer billing, and platform admin.

## Prerequisites

- Node.js 20.9+
- Docker (for local Postgres) or any PostgreSQL 16+

## Setup

```bash
cd erp
cp env.example .env
docker compose up -d
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

App: http://localhost:3001

Seeded super admin (from `.env`):

- Email: `admin@loopcstrategies.com`
- Password: value of `SEED_ADMIN_PASSWORD`

Demo coupon: `LAUNCH20` (20% off).

## Customer flow

Pricing → Signup → Checkout → Payment (Razorpay or mock) → Webhook activates subscription → `/app`

**Important:** Subscription becomes `ACTIVE` only after webhook confirmation (or `POST /api/checkout/mock-complete` in local/dev when Razorpay keys are empty).

## Admin

Login as super admin → http://localhost:3001/admin

Manage plans, coupons, subscriptions, payments, companies, billing settings.

## Jobs

```bash
npm run jobs:billing
```

Expires trials, applies grace → `SUSPENDED`, and scheduled downgrades.

Or call `GET /api/cron/billing` with header `Authorization: Bearer $CRON_SECRET` when set.

## Env

See [`env.example`](env.example). Set Razorpay keys + webhook secret for production. Never store card data — only provider IDs.
