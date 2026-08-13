# LoopC website

Monorepo for LoopC Business Strategies — one SaaS ecosystem, two apps, one Postgres.

| App | URL | Path |
|---|---|---|
| Marketing | http://localhost:3000 | [`site/`](site/) |
| ERP SaaS + Admin | http://localhost:3001 | [`erp/`](erp/) |
| Postgres | localhost:5433 | Docker Compose in `erp/` |

## Architecture

```
Marketing (:3000)  --public APIs-->  ERP (:3001)  -->  Postgres (:5433)
                                         ^
                                    Super Admin /admin
                                    controls CMS + billing
```

## Quick start

```bash
# DB
cd erp
docker compose up -d
cp env.example .env   # set SEED_ADMIN_PASSWORD, AUTH_SECRET, DATABASE_URL

npm install
npx prisma migrate dev
npm run db:seed
npm run db:seed:cms
npm run dev           # :3001

# Marketing (other terminal)
cd ../site
# set ERP_API_URL=http://localhost:3001 in .env.local
npm install
npm run dev           # :3000
```

Admin login uses credentials from `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in `erp/.env` (never commit real secrets).

## Key flows

1. Marketing → Pricing (DB plans) → Choose plan → ERP signup → checkout → webhook → ACTIVE → `/app`
2. Admin → Website CMS → edit services/blog/FAQ → appears on marketing without code changes
3. Admin → Plans → change price → both marketing and ERP pricing update from Postgres
