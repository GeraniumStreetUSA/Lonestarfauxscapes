# REDIRECTS: lonestarfauxscapes.com rebuild

Source: brief `califaux-main/prompt.md` section 5. Verified 2026-10-24 against the repo (`rebuild/homepage`) and live HTTP responses (curl, status + Location + robots + canonical for every URL below).
Rule: every live URL keeps its path or 301s ONE hop to its final destination. No chains.

## Decision for owner

1. **Trailing slash (decided, deviates from Califauxscapes):** keep every indexed path exactly as today, slashless (`/dallas`, `/blog/<slug>`). Prerender emits `dallas.html`, `blog/<slug>.html`; Cloudflare Pages serves the slashless path and auto-308s `/dallas/` to `/dallas`. This deviates from the Califauxscapes trailing-slash rule on purpose: changing format would 301 every ranking URL. Only exception: `/admin/` (Decap needs the directory).
2. **Suburb pages (owner to choose; default A):** plano, frisco, irving, arlington, sugar-land, the-woodlands are templated (543 to 713 words; plano vs frisco and sugar-land vs the-woodlands share about 60% of their text; no verified local projects). They fail the brief's "unique, verified local content" test.
   - A (default): keep path, keep `noindex, follow`, keep out of sitemap. Zero redirect risk.
   - B: fold, one-hop 301: plano, frisco, irving to `/dallas`; arlington to `/fort-worth` (Tarrant County; or `/dallas`, owner picks); sugar-land, the-woodlands to `/houston`.
3. **Projects rename (proposed, owner to approve; NOT applied):** brief wants `/projects/` with `/case-studies/` and `/gallery` 301ing to it. Today the opposite rule is live (`/projects` 301 `/case-studies`). Adopting it costs 5 indexed URLs (`/case-studies`, 3 case studies, `/gallery`) and requires deleting the `/projects` rule first or it loops. If approved, use slashless `/projects` and `/projects/<slug>` for consistency with decision 1.
4. **`/commercial-resources` fold into `/commercial` (proposed, owner to approve; NOT applied):** brief says fold it in. It is indexed and in the sitemap. Default: keep, strip internal notes.
5. **Use-case pages** (boxwood, fire-rated, HOA, pool hedge, pool living wall, Vallum FRX): default keep as use-case pages at current paths. Any fold into a system page is a later, owner-approved 301.
6. **`/lighthouse-report`:** currently 301 to `/installation`, but `config/indexing-rules.js` lists it as gone (410). Default: keep the 301 (current live behavior). Owner may prefer 410.
7. **Gone routes:** 410 handling was removed with `functions/_middleware.js` in commit 55a2946 (2026-03-26); those paths now return 404. Default: restore 410 in the new catch-all function (Table C).

## Counts

- Live sitemap (`/sitemap.xml` on production): **65** URLs. Committed `sitemap.xml`: **63**. The 2 extra are blog posts dated 2026-04-07 and 2026-04-09 in `content/blog` (`draft: false`) that `build-blog.js` publishes at build time; committed `blog/`, `content/posts.json` and `sitemap.xml` are stale. Brief's "65" and "34 posts" are correct for production.
- Table A: 65 sitemap + 6 suburb + 8 other HTML routes + 4 function endpoints + 6 public files = **89** URLs. Kept: **89**. Redirected: **0** (default decisions). 
- Table B: **30** legacy redirect sources carried over (each with bare, `.html`, `/` variants), all rewritten to one hop.

## Table A: every live URL

Indexable "yes" = `index, follow` meta, self canonical, HTTP 200 (all verified live).

| # | Live URL | New route | Action | Indexable | Notes |
|---|---|---|---|---|---|
| 1 | `/artificial-boxwood-hedge` | `/artificial-boxwood-hedge` | keep | yes | use-case page (brief allows fold into system page; default keep) |
| 2 | `/artificial-hedge` | `/artificial-hedge` | keep | yes |  |
| 3 | `/austin` | `/austin` | keep | yes | confirmed metro page; slashless path kept |
| 4 | `/blog` | `/blog` | keep | yes | blog index |
| 5 | `/case-studies` | `/case-studies` | keep | yes | brief proposes /projects/ (see decision 3); default keep; target of legacy /projects |
| 6 | `/commercial-resources` | `/commercial-resources` | keep | yes | brief proposes fold into /commercial (decision 4); default keep, strip internal notes |
| 7 | `/commercial-wall` | `/commercial-wall` | keep | yes | target of legacy /commercial-wall-covering |
| 8 | `/commercial` | `/commercial` | keep | yes | target of 3 legacy rules |
| 9 | `/contact` | `/contact` | keep | yes | target of legacy /get-quote |
| 10 | `/dallas` | `/dallas` | keep | yes | confirmed metro page; slashless path kept |
| 11 | `/fence-extensions` | `/fence-extensions` | keep | yes |  |
| 12 | `/fire-rated-artificial-hedge` | `/fire-rated-artificial-hedge` | keep | yes | use-case page; also target of legacy /fire-rated |
| 13 | `/fort-worth` | `/fort-worth` | keep | yes | confirmed metro page; slashless path kept |
| 14 | `/gallery` | `/gallery` | keep | yes | brief proposes 301 to /projects/ (see decision 3); default keep |
| 15 | `/guides` | `/guides` | keep | yes |  |
| 16 | `/hoa-approved-artificial-hedge` | `/hoa-approved-artificial-hedge` | keep | yes | use-case page |
| 17 | `/houston` | `/houston` | keep | yes | confirmed metro page; slashless path kept |
| 18 | `/` | `/` | keep | yes | home |
| 19 | `/installation` | `/installation` | keep | yes | target of legacy /lighthouse-report |
| 20 | `/living-wall` | `/living-wall` | keep | yes | target of legacy /artificial-living-wall |
| 21 | `/locations` | `/locations` | keep | yes | metro hub |
| 22 | `/pool-living-wall` | `/pool-living-wall` | keep | yes | use-case page |
| 23 | `/pool-privacy-hedge` | `/pool-privacy-hedge` | keep | yes | use-case page |
| 24 | `/pricing` | `/pricing` | keep | yes |  |
| 25 | `/products` | `/products` | keep | yes | systems hub |
| 26 | `/residential` | `/residential` | keep | yes | target of legacy /privacy-wall |
| 27 | `/san-antonio` | `/san-antonio` | keep | yes | confirmed metro page; slashless path kept |
| 28 | `/vallum-frx` | `/vallum-frx` | keep | yes | use-case page |
| 29 | `/blog/apartment-balcony-privacy-fire-safe-artificial-hedge-solutions` | `/blog/apartment-balcony-privacy-fire-safe-artificial-hedge-solutions` | keep | yes | in live sitemap only (published at build from content/blog, dated 2026-04); not in committed sitemap.xml or blog/ |
| 30 | `/blog/hotel-and-hospitality-artificial-greenery-design-meets-compliance` | `/blog/hotel-and-hospitality-artificial-greenery-design-meets-compliance` | keep | yes | in live sitemap only (published at build from content/blog, dated 2026-04); not in committed sitemap.xml or blog/ |
| 31 | `/blog/artificial-green-walls-for-texas-restaurants-and-bars` | `/blog/artificial-green-walls-for-texas-restaurants-and-bars` | keep | yes | blog post, URL kept |
| 32 | `/blog/texas-fire-code-requirements-for-artificial-plants-in-commercial-buildings` | `/blog/texas-fire-code-requirements-for-artificial-plants-in-commercial-buildings` | keep | yes | blog post, URL kept |
| 33 | `/blog/texas-backyard-privacy-solutions-compared-fences-hedges-walls` | `/blog/texas-backyard-privacy-solutions-compared-fences-hedges-walls` | keep | yes | blog post, URL kept |
| 34 | `/blog/best-artificial-living-wall-materials-for-texas-climate` | `/blog/best-artificial-living-wall-materials-for-texas-climate` | keep | yes | blog post, URL kept |
| 35 | `/blog/texas-property-code-202-007-artificial-hedges-and-hoa-rules` | `/blog/texas-property-code-202-007-artificial-hedges-and-hoa-rules` | keep | yes | blog post, URL kept |
| 36 | `/blog/real-vs-artificial-living-walls-in-texas-an-honest-comparison` | `/blog/real-vs-artificial-living-walls-in-texas-an-honest-comparison` | keep | yes | blog post, URL kept |
| 37 | `/blog/biophilic-design-with-artificial-green-walls-for-offices-and-retail` | `/blog/biophilic-design-with-artificial-green-walls-for-offices-and-retail` | keep | yes | blog post, URL kept |
| 38 | `/blog/green-wall-maintenance-in-texas-what-it-actually-takes` | `/blog/green-wall-maintenance-in-texas-what-it-actually-takes` | keep | yes | blog post, URL kept |
| 39 | `/blog/indoor-vs-outdoor-artificial-living-walls-materials-and-design` | `/blog/indoor-vs-outdoor-artificial-living-walls-materials-and-design` | keep | yes | blog post, URL kept |
| 40 | `/blog/artificial-hedge-maintenance-and-care-for-texas-homeowners` | `/blog/artificial-hedge-maintenance-and-care-for-texas-homeowners` | keep | yes | blog post, URL kept |
| 41 | `/blog/diy-vs-professional-artificial-hedge-installation` | `/blog/diy-vs-professional-artificial-hedge-installation` | keep | yes | blog post, URL kept |
| 42 | `/blog/how-long-do-artificial-hedges-last-in-texas-heat` | `/blog/how-long-do-artificial-hedges-last-in-texas-heat` | keep | yes | blog post, URL kept |
| 43 | `/blog/artificial-living-walls-for-restaurant-patios-in-texas` | `/blog/artificial-living-walls-for-restaurant-patios-in-texas` | keep | yes | blog post, URL kept |
| 44 | `/blog/artificial-greenery-roi-for-multifamily-property-managers` | `/blog/artificial-greenery-roi-for-multifamily-property-managers` | keep | yes | blog post, URL kept |
| 45 | `/blog/nfpa-701-vs-astm-e84-fire-ratings-for-artificial-greenery` | `/blog/nfpa-701-vs-astm-e84-fire-ratings-for-artificial-greenery` | keep | yes | blog post, URL kept |
| 46 | `/blog/pool-privacy-solutions-artificial-hedges-for-texas-backyards` | `/blog/pool-privacy-solutions-artificial-hedges-for-texas-backyards` | keep | yes | blog post, URL kept |
| 47 | `/blog/how-to-get-hoa-approval-for-artificial-hedges-in-texas` | `/blog/how-to-get-hoa-approval-for-artificial-hedges-in-texas` | keep | yes | blog post, URL kept |
| 48 | `/blog/dallas-privacy-without-the-watering-a-real-guide` | `/blog/dallas-privacy-without-the-watering-a-real-guide` | keep | yes | blog post, URL kept |
| 49 | `/blog/houston-no-water-greenery-fix-choosing-artificial-hedges` | `/blog/houston-no-water-greenery-fix-choosing-artificial-hedges` | keep | yes | blog post, URL kept |
| 50 | `/blog/artificial-living-walls-and-hedges-in-houston` | `/blog/artificial-living-walls-and-hedges-in-houston` | keep | yes | blog post, URL kept |
| 51 | `/blog/fire-rated-artificial-greenery-for-texas-commercial-properties` | `/blog/fire-rated-artificial-greenery-for-texas-commercial-properties` | keep | yes | blog post, URL kept |
| 52 | `/blog/the-complete-guide-to-artificial-hedges-in-texas` | `/blog/the-complete-guide-to-artificial-hedges-in-texas` | keep | yes | blog post, URL kept |
| 53 | `/blog/the-complete-guide-to-artificial-living-walls-in-texas` | `/blog/the-complete-guide-to-artificial-living-walls-in-texas` | keep | yes | blog post, URL kept |
| 54 | `/blog/artificial-living-walls-and-hedges-in-san-antonio` | `/blog/artificial-living-walls-and-hedges-in-san-antonio` | keep | yes | blog post, URL kept |
| 55 | `/blog/firewise-artificial-hedges-for-multi-family-units` | `/blog/firewise-artificial-hedges-for-multi-family-units` | keep | yes | blog post, URL kept |
| 56 | `/blog/artificial-living-walls-for-the-texas-summers` | `/blog/artificial-living-walls-for-the-texas-summers` | keep | yes | blog post, URL kept |
| 57 | `/blog/faux-living-walls-transforming-texas-office-spaces` | `/blog/faux-living-walls-transforming-texas-office-spaces` | keep | yes | blog post, URL kept |
| 58 | `/blog/why-fire-rated-artificial-hedges-are-ideal-for-texas` | `/blog/why-fire-rated-artificial-hedges-are-ideal-for-texas` | keep | yes | blog post, URL kept |
| 59 | `/blog/artificial-vs-real-living-walls-for-texas-homes` | `/blog/artificial-vs-real-living-walls-for-texas-homes` | keep | yes | blog post, URL kept |
| 60 | `/blog/artificial-vs-real-boxwood-texas` | `/blog/artificial-vs-real-boxwood-texas` | keep | yes | blog post, URL kept |
| 61 | `/blog/faux-green-walls-vs-real-plants-for-texas-homes` | `/blog/faux-green-walls-vs-real-plants-for-texas-homes` | keep | yes | blog post, URL kept |
| 62 | `/blog/artificial-hedges-vs-real-plants-in-texas` | `/blog/artificial-hedges-vs-real-plants-in-texas` | keep | yes | blog post, URL kept |
| 63 | `/case-studies/houston-restaurant-hedges` | `/case-studies/houston-restaurant-hedges` | keep | yes | case study; brief proposes /projects/<slug> (decision 3) |
| 64 | `/case-studies/houston-storefront-hedges` | `/case-studies/houston-storefront-hedges` | keep | yes | case study; brief proposes /projects/<slug> (decision 3) |
| 65 | `/case-studies/austin-high-end-residential-privacy` | `/case-studies/austin-high-end-residential-privacy` | keep | yes | case study; brief proposes /projects/<slug> (decision 3) |
| 66 | `/plano` | `/plano` | keep (or 301 `/dallas`, decision 2) | noindex | `noindex, follow` in meta and `_headers`; excluded from sitemap |
| 67 | `/frisco` | `/frisco` | keep (or 301 `/dallas`) | noindex | same |
| 68 | `/irving` | `/irving` | keep (or 301 `/dallas`) | noindex | same |
| 69 | `/arlington` | `/arlington` | keep (or 301 `/fort-worth`) | noindex | same |
| 70 | `/sugar-land` | `/sugar-land` | keep (or 301 `/houston`) | noindex | same |
| 71 | `/the-woodlands` | `/the-woodlands` | keep (or 301 `/houston`) | noindex | same |
| 72 | `/terms` | `/terms` | keep | noindex | `noindex, follow`; name legal entity once confirmed |
| 73 | `/privacy` | `/privacy` | keep | noindex | `noindex, follow`; target of legacy `/privacy-policy` |
| 74 | `/sitemap` | `/sitemap` | keep | noindex | HTML sitemap, `noindex, follow` |
| 75 | `/hedge-builder-residential` | `/hedge-builder-residential` | keep | noindex | posts to `/hedge-quote`; not in brief, owner may retire later |
| 76 | `/hedge-builder-commercial` | `/hedge-builder-commercial` | keep | noindex | same |
| 77 | `/404` | `/404` | keep | noindex | live returns **200** at `/404`; unknown paths return 404 with this body (correct). New app: real 404 status for unknown paths |
| 78 | `/admin/` | `/admin/` | keep (fix loop) | noindex | Decap CMS. **Live redirect loop**, see Defects 1 |
| 79 | `/admin` | `/admin/` | 308 (Pages auto) | noindex | one hop once loop is fixed |
| 80 | `/hedge-quote` | `/hedge-quote` | keep (function) | noindex | `functions/hedge-quote.js`: POST handler; GET returns 404 + `noindex, nofollow`; robots `Disallow` |
| 81 | `/api/contact` | `/api/contact` | keep (function) | n/a | POST from `/contact`, `/`, `cro.js`; robots `Disallow: /api/` |
| 82 | `/api/cms/auth` | `/api/cms/auth` | keep (function) | n/a | Decap OAuth (`admin/config.yml` `auth_endpoint`) |
| 83 | `/api/cms/auth/refresh` | `/api/cms/auth/refresh` | keep (function) | n/a | Decap token refresh |
| 84 | `/sitemap.xml` | `/sitemap.xml` | keep | n/a | must be regenerated from the new route list |
| 85 | `/robots.txt` | `/robots.txt` | keep | n/a | keep `Disallow: /admin/`, `/api/`, `/hedge-quote` |
| 86 | `/admin/config.yml` | `/admin/config.yml` | keep | noindex | `_headers` |
| 87 | `/downloads/Artificial-living-wall-spec-sheet.pdf` | same | keep | n/a | public asset |
| 88 | `/content/posts.json` | same | keep | n/a | copied by `post-build.js` |
| 89 | `/content/case-studies.json` | same | keep | n/a | copied by `post-build.js` |

Static asset folders (`/images/*`, `/favicon/*`, `/assets/*`, `/LIVING-WALL-MATS/*`, `/VALLUM/*`, `/mats/*`, `/case-studies/<slug>/*.avif`) must keep their paths; not listed per file.

## Table B: legacy redirects to carry over (one hop each)

Both `_redirects` and `public/_redirects` are identical except line 1's comment. `post-build.js` ships `public/_redirects`. Each source below must 301 directly to the destination for all three variants: bare, `.html`, trailing `/`. Rule order matters: explicit `.html` sources must sit ABOVE the global `/*.html` rule.

| Legacy source | Final destination | Live today |
|---|---|---|
| `/index.html` | `/` | 1 hop |
| `/admin/index.html` | `/admin/` | 1 hop to `/admin/`, which then loops (Defects 1) |
| `/projects` | `/case-studies` | bare and `/` 1 hop; `.html` 2 hops |
| `/get-quote` | `/contact` | bare and `/` 1 hop; `.html` 2 hops |
| `/privacy-policy` | `/privacy` | bare and `/` 1 hop; `.html` 2 hops |
| `/fire-rated` | `/fire-rated-artificial-hedge` | bare and `/` 1 hop; `.html` 2 hops |
| `/privacy-wall` | `/residential` | all 1 hop |
| `/lighthouse-report` | `/installation` (or 410, decision 6) | bare and `.html` 1 hop; `/` 2 hops |
| `/commercial-wall-covering` | `/commercial-wall` | all 1 hop |
| `/commercial-fire-retardant-tested-artificial-solutions` | `/commercial` | all 1 hop |
| `/residential-fire-retardant-tested-artificial-solutions` | `/commercial` | all 1 hop |
| `/artificial-living-wall` | `/living-wall` | bare and `.html` 1 hop; `/` 2 hops |
| `/blog/2026-01-03-artificial-living-walls-the-ultimate-guide-to-main` | `/blog/artificial-living-walls-for-the-texas-summers` | live: bare 1 hop; `.html` 2 hops (its explicit `.html` rule is dead, it sits below `/*.html`); `/` 404 |
| `/blog/2026-02-21-how-to-get-hoa-approval-for-artificial-hedges-in-texas` | `/blog/how-to-get-hoa-approval-for-artificial-hedges-in-texas` | live: bare 1 hop; `.html` 2 hops; `/` 404 |
| `/blog/2026-02-23-dallas-privacy-without-the-watering-a-real-guide-t` | `/blog/dallas-privacy-without-the-watering-a-real-guide` | live: bare 1 hop; `.html` 2 hops; `/` 404 |
| `/blog/2026-02-23-houston-s-no-water-greenery-fix-choosing-artificia` | `/blog/houston-no-water-greenery-fix-choosing-artificial-hedges` | live: bare 1 hop; `.html` 2 hops; `/` 404 |
| `/blog/2026-02-21-artificial-living-walls-and-hedges-in-houston-a-lo` | `/blog/artificial-living-walls-and-hedges-in-houston` | live: bare 1 hop; `.html` 2 hops; `/` 404 |
| `/blog/2026-02-21-fire-rated-artificial-greenery-for-texas-commercial-properties` | `/blog/fire-rated-artificial-greenery-for-texas-commercial-properties` | live: bare 1 hop; `.html` 2 hops; `/` 404 |
| `/blog/2026-02-21-the-complete-guide-to-artificial-hedges-in-texas` | `/blog/the-complete-guide-to-artificial-hedges-in-texas` | live: bare 1 hop; `.html` 2 hops; `/` 404 |
| `/blog/2026-02-21-the-complete-guide-to-artificial-living-walls-in-texas` | `/blog/the-complete-guide-to-artificial-living-walls-in-texas` | live: bare 1 hop; `.html` 2 hops; `/` 404 |
| `/blog/2026-02-20-artificial-living-walls-and-hedges-in-san-antonio-` | `/blog/artificial-living-walls-and-hedges-in-san-antonio` | live: bare 1 hop; `.html` 2 hops; `/` 404 |
| `/blog/2026-02-03-firewise-artificial-hedges-for-multi-family-units` | `/blog/firewise-artificial-hedges-for-multi-family-units` | live: bare 1 hop; `.html` 2 hops; `/` 404 |
| `/blog/2025-12-14-faux-living-walls-transforming-texas-office-spaces` | `/blog/faux-living-walls-transforming-texas-office-spaces` | live: bare 1 hop; `.html` 2 hops; `/` 404 |
| `/blog/2025-12-13-why-fire-rated-artificial-hedges-are-ideal-for-tex` | `/blog/why-fire-rated-artificial-hedges-are-ideal-for-texas` | live: bare 1 hop; `.html` 2 hops; `/` 404 |
| `/blog/2025-12-12-artificial-vs-real-living-walls-for-texas-homes` | `/blog/artificial-vs-real-living-walls-for-texas-homes` | live: bare 1 hop; `.html` 2 hops; `/` 404 |
| `/blog/2025-12-11-artificial-vs-real-boxwood-texas` | `/blog/artificial-vs-real-boxwood-texas` | live: bare 1 hop; `.html` 2 hops; `/` 404 |
| `/blog/2025-12-10-faux-green-walls-vs-real-plants-for-texas-homes` | `/blog/faux-green-walls-vs-real-plants-for-texas-homes` | live: bare 1 hop; `.html` 2 hops; `/` 404 |
| `/blog/2025-12-09-artificial-hedges-vs-real-plants-in-texas-which-is` | `/blog/artificial-hedges-vs-real-plants-in-texas` | live: bare 1 hop; `.html` 2 hops; `/` 404 |
| `/blog/2026-01-31-artificial-living-walls-for-the-texas-summers` | `/blog/artificial-living-walls-for-the-texas-summers` | live: bare 1 hop; `.html` 2 hops; `/` 404 |
| `/blog/2026-02-21-nfpa-701-vs-astm-e84-fire-ratings-for-artificial-greenery` | `/blog/nfpa-701-vs-astm-e84-fire-ratings-for-artificial-greenery` | live: bare 1 hop; `.html` 2 hops; `/` 404 |

Global normalization (keep): `/*.html` to `/:splat` 301 (one hop for every kept page). Drop the global `/:path/ /:path 301` rule and the 4 explicit slash rules for real pages (`/contact/`, `/fence-extensions/`, `/residential/`, `/commercial/`): Pages already 308s `/foo/` to `/foo` when `foo.html` exists, and the global rule causes Defects 1.

## Table C: gone (410)

From `GONE_ROUTE_PATHS` in `config/indexing-rules.js`, each with and without trailing slash. Live: 404 (410 middleware deleted). Restore 410 + `X-Robots-Tag: noindex` in the catch-all function.

`/hero-backup`, `/hero-backup.html`, `/lighthouse-report.json`, `/lh-scores.json`, `/navbar-component`, `/navbar-component.html`, `/navbar-universal`, `/navbar-universal.html`, `/roadmap`, `/roadmap.html`, `/sample-page/feed`, `/understanding-responsible-gambling-practices-a`, `/mastering-advanced-casino-strategies-a`, `/seasonal-shifts-how-trends-influence-gambling`. (`/lighthouse-report` and `.html`: see decision 6.)

## Host-level rules (Cloudflare, unchanged)

- `http://lonestarfauxscapes.com/*`, `http://www.*`, `https://www.*` to `https://lonestarfauxscapes.com/:splat` 301. Verified live, path preserved, 1 hop.
- The three host lines in `_redirects` should be treated as documentation only: Pages `_redirects` does not support domain-level rules, so the live behavior comes from a Cloudflare zone rule. Leave that rule as is; do not depend on the `_redirects` lines.
- Accepted edge: `https://www.../dallas.html` takes 2 hops (host, then `.html`). Fixable only in the zone rule.
- `_headers` keeps `X-Robots-Tag: noindex` on `lonestarfauxscapes-main.pages.dev`.

## Defects found

1. **`/admin/` redirect loop (live, CMS unreachable at its canonical URL).** `/admin/` 301 to `/admin` (global `/:path/ /:path` rule), then Pages 308 `/admin` to `/admin/` (directory index). Fix: remove the global slash rule (see Table B note).
2. **Chains (2 hops):** `.html` variants of `/projects`, `/get-quote`, `/privacy-policy`, `/fire-rated`, and all 18 legacy blog slugs (`/*.html` strips, then the slug rule fires). Trailing-slash variants of `/artificial-living-wall` and `/lighthouse-report`.
3. **Dead rule:** `/blog/2026-01-03-...-main.html` explicit rule sits below `/*.html`, never matches.
4. **404s:** legacy blog slugs with trailing slash (e.g. `/blog/2026-02-21-the-complete-guide-to-artificial-hedges-in-texas/`) return 404: `/:path/` only matches one segment and Pages auto-slash only applies to existing files.
5. **410 regression:** `GONE_ROUTE_PATHS` is dead config since 55a2946; those URLs 404 instead of 410.
6. **Stale committed build outputs:** `sitemap.xml`, `blog/`, `content/posts.json` lack the 2 April posts that production serves. The new build must derive all three from `content/blog` the same way.
7. **`/404` returns 200** when requested directly (noindex, so low impact).
8. **Internal link through a redirect:** `functions/hedge-quote.js` result page links `/index.html` (301 to `/`). Use `/`.
9. No broken internal `href` targets found across root, `blog/`, `case-studies/` HTML (96 unique paths checked).
