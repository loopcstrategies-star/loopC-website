# LoopC Business Strategies — website

Next.js 16 (App Router) marketing site for LoopC Business Strategies, a software development company on OMR, Chennai.

## Local development

```bash
cd site
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Node.js 20.9+ is required.

## Environment

Copy [`env.example`](env.example) to `.env.local`.

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata, sitemap and Open Graph. |
| `FORMSPREE_FORM_ID` | Server-only Formspree form id for the contact API. |
| `CONTACT_TO_EMAIL` | Server-only fallback inbox if Formspree is unset. |
| `TURNSTILE_SECRET_KEY` | Optional Cloudflare Turnstile secret. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Optional Turnstile site key (public). |

Company identity, location and unpublished contact fields live in [`lib/site-config.ts`](lib/site-config.ts). Empty phone, WhatsApp, email, GST and social URLs stay hidden until verified values are added.

## Production

```bash
npm run build
npm start
```

On Vercel (or similar), set the project **Root Directory** to `site`.

## Routes

`/`, `/services`, `/services/[slug]`, `/solutions`, `/work`, `/work/[slug]`, `/industries`, `/industries/[slug]`, `/about`, `/insights`, `/insights/[slug]`, `/contact`, `/privacy`, `/terms`, `/brochure`.

## Contact API

`POST /api/contact` validates input on the server, applies a honeypot, optional Turnstile, rate limiting and size limits. Delivery uses server-only env vars — never a public Formspree id.
