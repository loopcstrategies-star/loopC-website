# LoopC Business Strategies — website

Next.js 16 (App Router) marketing site for LoopC Business Strategies (OMR, Chennai).

This app is **marketing only**. Signup, checkout, billing and Super Admin live in the portal app (`erp/` in this monorepo). The LoopC ERP product is a separate external application.

## Local development

```bash
cd site
cp env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Node.js 20.9+ is required.

## Environment

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata, sitemap and Open Graph |
| `NEXT_PUBLIC_ERP_URL` | Portal base URL (signup / login links) |
| `ERP_API_URL` | Server-side portal public API (CMS, plans, contact, blog) |
| `FORMSPREE_FORM_ID` | Optional fallback if portal contact API is unreachable |
| `CONTACT_TO_EMAIL` | Optional Formsubmit fallback |
| `TURNSTILE_SECRET_KEY` / `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Optional Cloudflare Turnstile |

Company identity lives in [`lib/site-config.ts`](lib/site-config.ts).

## Production

```bash
npm run build
npm start
```

On Vercel, set the project **Root Directory** to `site`.

## Routes

`/`, `/about`, `/services`, `/services/[slug]`, `/solutions`, `/erp`, `/features`, `/benefits`, `/pricing`, `/work`, `/work/[slug]`, `/industries`, `/industries/[slug]`, `/blog`, `/blog/[slug]`, `/contact`, `/privacy`, `/terms`, `/cookies`, `/brochure`.

## Contact API

`POST /api/contact` validates input, applies honeypot, optional Turnstile, rate limiting, then forwards to the portal `/api/public/contact`.
