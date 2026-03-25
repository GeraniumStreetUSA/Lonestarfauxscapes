# Security / Index Cleanup

## What was removed

- Deleted internal-only source artifacts that should never ship:
  - `hero-backup.html`
  - `lighthouse-report.html`
  - `lighthouse-report.json`
  - `lh-scores.json`
  - `navbar-component.html`
  - `navbar-universal.html`
  - `roadmap.html`
- Added runtime `410 Gone` handling for the removed routes and the leftover `/sample-page/feed/` path in [functions/_middleware.js](/C:/dev/loanstar/functions/_middleware.js).
- Excluded non-production and utility pages from build-time and sitemap-time route discovery in [vite.config.ts](/C:/dev/loanstar/vite.config.ts), [config/indexing-rules.js](/C:/dev/loanstar/config/indexing-rules.js), and [scripts/generate-sitemap.js](/C:/dev/loanstar/scripts/generate-sitemap.js).
- Marked valid utility routes as non-indexable:
  - `/admin/` and `/admin/config.yml` via [_headers](/C:/dev/loanstar/_headers)
  - `/sitemap` via [_headers](/C:/dev/loanstar/_headers) and [sitemap.html](/C:/dev/loanstar/sitemap.html)
  - `/api/contact`, `/api/cms/auth`, `/api/cms/auth/refresh`, and `/hedge-quote` via response headers in the relevant Pages Functions
- Fixed [scripts/post-build.js](/C:/dev/loanstar/scripts/post-build.js) so `ALLOW_INDEXING=false` only manages a dedicated global noindex block and does not strip intentional route-specific `X-Robots-Tag` headers.
- Added `.gitignore` rules so Lighthouse export files are less likely to be recommitted.

## How it was being exposed

- `vite.config.ts` was still auto-including any root `.html` file except a short hard-coded exclusion list. That allowed `lighthouse-report.html` and `navbar-universal.html` to reach production builds.
- `scripts/generate-sitemap.js` already excluded some junk pages, but it still treated `sitemap.html` as a normal indexable page.
- `_headers` only had noindex rules for privacy/terms and a stale `/sample-page/feed/` path. It did not protect `/admin/`, `/admin/config.yml`, or `/sitemap`.
- `scripts/post-build.js` removed every `X-Robots-Tag: noindex, nofollow` line when indexing was enabled. That made it unsafe to add deliberate utility-route noindex headers.
- The Lighthouse report artifacts embedded `https://lonestarfauxscapes.pages.dev/` URLs directly, so if the report page was public it exposed staging-domain crawl paths and viewer assets.

## Injection Vector Audit

### CMS markdown and content directories

- `content/blog/*.md`: active Decap CMS source. No gambling/pharma/spam content found in repo search.
- `content/case-studies/*.md`: active case study source. No suspicious content found.
- `content/locations/**`: present in repo but not part of the current build pipeline. This is content drift, not an active indexation source.

### Generated static files

- `blog/*.html` and `case-studies/*.html` are generated from markdown and remain production content.
- Root utility/demo/report files were the main exposure because Vite discovered root `.html` files automatically.
- `admin/config.yml` is intentionally copied to `dist/admin/config.yml` for Decap CMS and must stay public, but it now has `noindex, nofollow`.

### Deploy artifacts and staging traces

- Lighthouse exports were the only clear staging/report artifacts found in the repo, and they referenced the `lonestarfauxscapes.pages.dev` hostname.
- No additional report viewers, gambling pages, or spam landing pages were found in tracked content.

### Plugins, adapters, and dependencies

- Vite config uses no custom plugin/adaptor chain beyond the core build.
- Dependencies are limited to `vite`, `terser`, `sharp`, `marked`, `gray-matter`, `typescript`, and `@types/node`. No obviously suspicious package was found in `package.json`.

### Admin/editor paths

- `/admin/` is a valid Decap CMS route and already had a meta robots tag. The cleanup adds header-level noindex protection and covers `admin/config.yml`.
- `/api/cms/auth` and `/api/cms/auth/refresh` are valid utility endpoints. The cleanup adds `X-Robots-Tag` on function responses.

## Ops TODOs

- Purge removed URLs from the CDN cache after deploy, especially:
  - `/lighthouse-report`
  - `/lighthouse-report.html`
  - `/lighthouse-report.json`
  - `/lh-scores.json`
  - `/navbar-universal`
  - `/navbar-component`
  - `/roadmap`
  - `/hero-backup`
  - `/sample-page/feed/`
- In Google Search Console and Bing Webmaster Tools, request removal for the same URLs if they are already indexed.
- Review Cloudflare Pages project settings and old deployments for any still-live `pages.dev` preview URLs or branch deployments exposing internal artifacts. Repo changes cannot revoke old deployment snapshots.
- Check Cloudflare DNS / redirects / edge rules for any junk routes being served outside the Pages Functions path. This repo can only control requests that reach the current Pages deployment.
- If any removed URL was cached by third-party scanners or linked externally, expect a delay before `410` replaces the old indexed result.
