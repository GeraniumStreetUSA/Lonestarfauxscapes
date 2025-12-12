# Lone Star Faux Scapes

Static site built with Vite and hosted on Cloudflare Pages.

## Local Development

**Prerequisites:** Node.js

1. Install dependencies: `npm install`
2. Run the dev server: `npm run dev`

## Build

Build output goes to `dist/`:

- `npm run build`

## Cloudflare Pages

Recommended settings:

- **Build command:** `npm run build`
- **Build output directory:** `dist`

### Pages Functions (Backend)

This repo includes Cloudflare Pages Functions for “backend” behavior:

- `POST /api/contact` — sends the homepage contact form via Resend
- `POST /hedge-quote` — handles the hedge builder quote form via Resend
- `GET /api/cms/auth` — GitHub OAuth for Decap CMS (`/admin`)

### Cloudflare Pages Environment Variables

Required:

- `RESEND_API_KEY` (secret)
- `TO_EMAIL` (secret)
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`

Optional:

- `FROM_NAME`
- `FROM_EMAIL`
- `ALLOWED_ORIGINS` (comma-separated, for CORS on `/api/contact`)
- `TURNSTILE_SECRET_KEY` (enables Turnstile bot protection on `/api/contact`)
- `CMS_ALLOWED_HOSTS` (comma-separated hostnames allowed to use `/api/cms/auth`)

## Standalone Worker (Optional)

`workers/contact-form.js` is a standalone Cloudflare Worker version of the contact form handler.
It is still referenced as a fallback from `index.html`, but the preferred path is the Pages Function at `/api/contact`.
