# Launch Checklist

## Scope

This checklist covers the current launch candidate after the technical cleanup, SEO foundation, homepage rewrite, pricing rewrite, CRO layer, case-study system, local-page updates, B2B hub, and blog architecture changes.

## QA Summary

### Repo-level checks completed

- `npm run build` passes.
- Key routes render in local preview:
  - `/`
  - `/pricing`
  - `/contact`
  - `/blog`
  - `/blog/artificial-greenery-roi-for-multifamily-property-managers`
  - `/dallas`
  - `/gallery`
- Automated crawl of the production build returned:
  - 62 HTML pages checked
  - 0 broken internal links
  - 0 missing images
  - 0 missing canonicals
  - 0 canonical mismatches
  - 0 schema parse errors
  - 0 missing schema blocks
  - 0 duplicate titles
  - 0 duplicate meta descriptions
  - 0 orphaned pages
  - 0 junk/report/staging pages exposed
  - 0 `noindex` URLs left in the sitemap
- Manual browser checks passed for:
  - desktop navigation consistency
  - mobile menu behavior
  - sticky mobile CTA on pricing
  - generated blog post template rendering
  - key CTA/event hooks

### Launch fixes made during QA

- Disabled split-text animation by default in `split-text.js` so hero headlines no longer render as letter-by-letter DOM on blog and city pages.
- Fixed legacy dated blog links in `scripts/build-blog.js` so old internal article links resolve to current timeless slugs.
- Replaced three missing image references in `content/blog/2025-12-09-artificial-hedges-vs-real-plants-in-texas-which-is.md`.

## Repo-Complete Tasks

- [x] Remove junk/report/demo pages from the production build.
- [x] Return removed junk routes as `410 Gone`.
- [x] Exclude junk, thin utility, and noindex routes from `sitemap.xml`.
- [x] Normalize canonical tags, robots, OG/Twitter tags, breadcrumbs, and schema.
- [x] Keep suburb support pages live but `noindex, follow`.
- [x] Standardize the universal nav from the homepage source.
- [x] Add reusable CRO tracking, quote widgets, and mobile sticky CTA.
- [x] Add case-study content model, listing page, and seeded project profiles.
- [x] Add B2B resource hub and internal links from commercial/blog flows.
- [x] Rebuild blog index and blog post internal-linking structure.
- [x] Confirm no public `TODO` or owner-review placeholders are live in built HTML.

## Host / CDN / Search Console Tasks

- [ ] Deploy the current build and verify `_headers` and `_redirects` are honored in the real hosting environment.
- [ ] In Search Console, submit the current `https://lonestarfauxscapes.com/sitemap.xml`.
- [ ] In Search Console, request removals for any previously indexed junk URLs if they still appear in coverage reports.
- [ ] Verify Google is seeing `410` for removed junk/report URLs, not a soft 404.
- [ ] Confirm the canonical host is `https://lonestarfauxscapes.com` everywhere.
- [ ] Verify `robots.txt` and `sitemap.xml` are reachable from the live domain.
- [ ] Verify no staging, `pages.dev`, or preview hostname is internally linked from the live site.

## Analytics Verification Tasks

- [ ] Confirm whether GA4 or GTM is injected at the host layer. No GA4 measurement ID or GTM container was found in-repo.
- [ ] In GA4 DebugView or GTM Preview, verify these events on the live domain:
  - `phone_click`
  - `email_click`
  - `form_start`
  - `form_submit`
  - `form_submit_error`
  - `cta_click`
  - `gallery_contact_journey`
- [ ] Mark the final conversion events in GA4 admin after verifying event receipt.
- [ ] Confirm no PII is being sent as event properties.
- [ ] Test call/email/quote events on mobile and desktop.

## Form / Conversion Verification Tasks

- [ ] Test homepage form submission on the real domain. Local preview cannot fully validate Turnstile.
- [ ] Test contact page form submission on the real domain.
- [ ] Confirm the email body includes:
  - project location
  - project type / audience
  - project message
- [ ] Confirm success and validation states render correctly in production.
- [ ] Confirm mobile sticky CTA appears only after scroll and hides near footer/contact targets.

## Post-Launch Monitoring Tasks

- [ ] Check Search Console coverage for:
  - excluded suburb pages staying excluded
  - removed junk URLs falling out of the index
  - sitemap acceptance
- [ ] Check live crawl logs or Cloudflare analytics for repeated hits to removed junk URLs.
- [ ] Watch GA4 or GTM for event volume anomalies and duplicate event firing.
- [ ] Review form submissions and call/email click rates against pre-launch baseline.
- [ ] Re-check top landing pages in PageSpeed Insights once live.

## Business-Owner Input Needed

- Confirm whether the public Spicewood address and listed business hours on `/contact` should remain public-facing.
- Confirm whether exact warranty language should be published anywhere beyond the current request-based B2B flow.
- Confirm any future public pricing ranges beyond the two approved starting examples.
- Confirm whether downloadable fire documents, submittals, or spec packets should be published directly or remain request-only.

## Risks / Follow-Ups

### Still not fully validated in-repo

- Cloudflare Turnstile cannot be fully verified from local preview on `127.0.0.1`.
- Real GA4/GTM ingestion cannot be confirmed without the production analytics container/property.
- Redirect and header behavior still need one live-domain verification pass after deploy.

### Performance follow-up

- The build still contains several very large source images in `dist/assets/images`, including files above 1 MB and some above 2 MB. The site works, but image compression and variant cleanup should be a post-launch performance pass.

### Build warnings still present

- Vite still reports legacy non-module script warnings.
- Vite still reports unresolved `__VITE_ASSET__...` placeholders in some pages.
- These are not blocking build output, but they should be cleaned up in a future frontend hardening pass.
