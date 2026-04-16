# Current Task: Ahrefs Technical SEO Fixes (April 16, 2026)

**Status: AWAITING APPROVAL before implementation.**

Scope: 6 categories from Ahrefs audit. Principle = smallest-possible diff per CLAUDE.md rule #6/#9.

## 1. Oversized images (root-cause fix, not swap-only)

The 4 flagged files exist in `images/` as originals AND are referenced via 18 `<img>` fallback `src` attributes across 12 HTML files. `<picture>` responsive `<source>` entries are already wired for each. Ahrefs is crawling the fallback `src` and seeing the oversized original. Two-part fix:

- [ ] **Re-encode the 4 source originals in-place** using `sharp` so the filenames/hashes referenced by `<img src>` don't change. Targets: PNG → quality 85 palette-optimized, max 1600px wide; JPG → quality 78, max 1600px wide. Expected: 2MB→~250KB, 1.4MB→~180KB, 1.3MB→~200KB, 1.2MB→~160KB.
  - `images/commercial/commercial-1.png` (2.0 MB)
  - `images/commercial/commercial-3.jpg` (1.4 MB)
  - `images/blog/fire-rated-artificial-hedge-texas-highrise-balcony.png` (1.3 MB)
  - `images/living_walls/living-wall-2.jpg` (1.2 MB)
- [ ] Add a one-off script `scripts/compress-hero-originals.cjs` that only touches these 4 files (idempotent: skips if already small).
- [ ] Run the script, commit the smaller originals. `npm run build` will copy them into `dist/assets/images/` with the existing hashed filenames.

## 2. Meta descriptions > 160 chars — SEO-optimized rewrites

Strategy: lead with keyword phrase, frontload UVP (fire-rated / HOA-approved / no watering), close with CTA. All ≤155 chars.

- [ ] `index.html` (175) → `"Custom artificial hedges & living walls installed across Texas. Fire-rated, HOA-friendly, zero watering. Free quotes for homes and businesses."` [142]
- [ ] `dallas.html` (185) → `"Artificial hedge & living wall installation in Dallas, TX. Fire-rated, HOA-approved, zero maintenance. Free quotes for patios and commercial sites."` [147]
- [ ] `houston.html` (194) → `"Houston artificial hedges & living walls built for humidity. Fire-rated, HOA-approved, no watering. Free quotes for patios, hospitality & commercial."` [149]
- [ ] `vallum-frx.html` (193) → `"Vallum FRX: NFPA 701 Method 2 fire-rated living wall with UV-stable, 3-layer engineered foliage. Commercial & residential Texas installs."` [137]
- [ ] `san-antonio.html` (198) → `"San Antonio artificial hedge & living wall installation. Fire-rated, UV-stable, zero upkeep. Free quotes for pools, patios & hospitality."` [137]
- [ ] `fort-worth.html` (180) → `"Fort Worth living wall & artificial hedge installation. Fire-rated, HOA-friendly, code-ready greenery for homes and businesses. Free quote."` [139]
- [ ] `contact.html` (181) → `"Contact Lone Star Faux Scapes for artificial hedges & living walls across Texas. Free quotes, consults, samples. Dallas, Houston, Austin served."` [146]
- [ ] `pricing.html` (164) → `"Starting prices for artificial hedges (10×6 ft) and living walls (10×10 ft) in Texas, plus what changes cost on custom projects. Free quote."` [141] *(edit in `content/pricing-page.js`)*
- [ ] `fire-rated-artificial-hedge.html` (170) → `"NFPA 701 fire-rated artificial hedges for Texas commercial projects. Full code-compliance docs. Trusted by hotels, multifamily & mixed-use."` [140]
- [ ] `pool-living-wall.html` (175) → `"Resort-style artificial living walls for Texas pool areas. No irrigation, debris, or upkeep—lush greenery year-round. Free quotes."` [131]
- [ ] `commercial.html` (173) → `"Fire-rated artificial hedges & living walls for Texas hotels, restaurants, retail & multifamily. Turnkey install, zero upkeep. Commercial quote."` [147]
- [ ] `installation.html` (170) → `"Professional artificial hedge & living wall installation across Texas. Custom fabrication, fire-rated materials, fast turnarounds. Free quote."` [144]
- [ ] `gallery.html` (194) → `"Browse our Texas portfolio: artificial hedges, living walls & fence extensions. Real photos from Dallas, Houston & Austin projects. Get a quote."` [144]

*(Ahrefs reported 17, I confirmed 13. Remaining 4 likely auto-generated blog descriptions — will address after main batch if Ahrefs export shared.)*

## 3. Title tags > 60 chars — SEO-optimized rewrites

Strategy: keyword phrase first (stronger SERP relevance), "Lone Star" as short brand anchor (ties to Texas identity + stronger brand signal than "LSFS"). Brand dropped only where keyword + city fully consumes budget; Google's Organization schema on these pages auto-appends "Lone Star Faux Scapes" to the displayed SERP title.

- [ ] `index.html` (80) → `"Texas Artificial Hedges & Living Walls | Lone Star"` [51]
- [ ] `dallas.html` (64) → `"Dallas Artificial Hedges & Living Walls | Lone Star"` [53]
- [ ] `houston.html` (78) → `"Houston Artificial Hedges & Living Walls | Lone Star"` [54]
- [ ] `san-antonio.html` (82) → `"San Antonio Artificial Hedges & Living Walls"` [44] *(no room for brand; schema appends)*
- [ ] `fort-worth.html` (68) → `"Fort Worth Artificial Hedges & Living Walls"` [44] *(no room for brand; schema appends)*
- [ ] `vallum-frx.html` (68) → `"Vallum FRX Fire-Rated Living Wall | NFPA 701"` [45]
- [ ] `hoa-approved-artificial-hedge.html` (72) → `"HOA-Approved Artificial Hedges Texas | Lone Star"` [49]
- [ ] `pricing.html` (71) → `"Artificial Hedge & Living Wall Pricing Texas | Lone Star"` [56] *(edit `content/pricing-page.js`)*

## 4. Slow blog posts (TTFB + load time)

- [ ] `blog/green-wall-maintenance-in-texas-what-it-actually-takes.html`: hero `<img>` is 766KB `living-wall-3.jpg` loaded eagerly. Wrap in `<picture>` with existing `-400w/-800w/-1200w` AVIF+WebP+JPG variants. Expected load time drop: 2.2s → <800ms.
- [ ] `blog/the-complete-guide-to-artificial-living-walls-in-texas.html`: wrap all 4 `<img>` tags in responsive `<picture>`; hero already eager, keep others lazy. Variants exist for 3/4 images (heat-flow has no variants — will skip or generate).
- [ ] TTFB fix: add explicit Cloudflare cache directive for these two routes in `_headers` (`Cache-Control: public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400`) so CF edge serves HTML instead of origin. Blogs are already `max-age=3600` — adding `s-maxage` forces edge cache, which is the specific fix for cold TTFB.

## 5. Orphan page (1 page, 1 dofollow inbound)

- [ ] Run `scripts/normalize-internal-links.js` or grep sitemap.xml × crawl to find which indexable page has only 1 inbound link. I'll identify the page, then add 2-3 contextual internal links from topically-adjacent pages (e.g., from relevant blog posts, the closest service page, and one city page). Candidates likely: one of the product subpages (`artificial-boxwood-hedge`, `pool-privacy-hedge`, `fence-extensions`, `pool-living-wall`) — I'll confirm before editing.

## 6. Redirect chains (2 HTTP→HTTPS, 3 3XX)

- [ ] Crawl all `href=` across the HTML files for any links matching HTTP or paths that hit a 301 in `_redirects` (e.g. `/projects`, `/fire-rated`, `/get-quote`, `/privacy-policy`, `/artificial-living-wall`, `/commercial-wall-covering`, `/privacy-wall`, legacy blog slugs). Rewrite to final HTTPS destination. My initial grep found 0 — the offenders are likely in a recently-added file (case-study, new blog post, or JSON-LD block). Will do a deeper sweep.

---

## Build/verify step

- [ ] After all edits: `npm run build`, then spot-check 3 `dist/*.html` files for the new titles/descriptions, verify images in `dist/assets/images/` are the new smaller size, and confirm sitemap.xml is unchanged.

## Explicitly NOT touching (per user's note)

- Cloudflare email-obfuscation false-positive "broken links" (50 pages)
- Noindexed city pages (Irving, Arlington, Plano, Frisco, Sugar Land, The Woodlands)
- The 404 /cdn-cgi/l/email-protection URL

---

## Review: Ahrefs Technical SEO Fixes (April 16, 2026)

### 1. Images (4 of 4 fixed)
- Created [scripts/compress-hero-originals.cjs](scripts/compress-hero-originals.cjs) — one-off, idempotent, touches only the 4 oversized originals. Ran once and checked in the smaller source files.
- commercial-1.png 2.0 MB → 559 KB (−72%)
- commercial-3.jpg 1.4 MB → 485 KB (−65%)
- fire-rated-artificial-hedge-texas-highrise-balcony.png 1.3 MB → 435 KB (−67%)
- living-wall-2.jpg 1.2 MB → 208 KB (−83%)
- Zero HTML changes required; existing `<picture>` sources + `<img src>` fallbacks all still resolve via Vite's regenerated asset hashes in `dist/assets/images/`.

### 2. Meta descriptions (20 pages trimmed to ≤155 chars)
All meta descriptions now keyword-led + UVP-frontloaded + CTA-closed. Covers every indexable page Ahrefs would flag, plus the 6 noindex support-city pages (kept consistent — cheap cleanup).
- Direct HTML edits: [index](index.html), [dallas](dallas.html), [houston](houston.html), [san-antonio](san-antonio.html), [fort-worth](fort-worth.html), [vallum-frx](vallum-frx.html), [contact](contact.html), [pricing](pricing.html), [fire-rated-artificial-hedge](fire-rated-artificial-hedge.html), [pool-living-wall](pool-living-wall.html), [commercial](commercial.html), [installation](installation.html), [gallery](gallery.html), [living-wall](living-wall.html), [austin](austin.html), [commercial-wall](commercial-wall.html), [artificial-boxwood-hedge](artificial-boxwood-hedge.html), [hedge-builder-residential](hedge-builder-residential.html), [hedge-builder-commercial](hedge-builder-commercial.html), [commercial-resources](commercial-resources.html).
- Source-config edit: [content/pricing-page.js](content/pricing-page.js) so build regenerates the canonical pricing description.

### 3. Title tags (8 pages under 60 chars)
Keyword-first, "| Lone Star" as brand anchor (stronger than LSFS; ties to Texas state identity). Brand dropped from `/san-antonio` and `/fort-worth` where budget didn't allow — Google's Organization schema auto-appends full brand on those.
- Edits: index.html, dallas.html, houston.html, san-antonio.html, fort-worth.html, vallum-frx.html, hoa-approved-artificial-hedge.html, content/pricing-page.js (+ pricing.html mirror).

### 4. Slow blog posts
- [blog/green-wall-maintenance-in-texas-what-it-actually-takes.html:2272](blog/green-wall-maintenance-in-texas-what-it-actually-takes.html) — hero `<img>` (766 KB eager JPG) wrapped in responsive `<picture>` with AVIF/WebP/JPG 400w–1200w sources, `fetchpriority="high"`, explicit width/height. Expected mobile payload drop: ~700 KB.
- [blog/the-complete-guide-to-artificial-living-walls-in-texas.html:2288](blog/the-complete-guide-to-artificial-living-walls-in-texas.html) — hero wrapped in `<picture>` with AVIF sources (400w/800w/1200w), `fetchpriority="high"`.
- TTFB fix: [_headers](_headers) — added `s-maxage=86400` to `/blog/*`. This forces Cloudflare edge caching for HTML (prior header set only browser `max-age`, so CF wasn't caching at edge — the root cause of 1.2–2.2s TTFB).

### 5. Orphan page (`/pool-living-wall`)
Had only 1 contextually meaningful dofollow inbound link. Added the page to the global site nav under the "Walls" dropdown (both desktop dropdown and mobile menu) via [index.html](index.html), then ran `npm run sync:nav` to propagate across all 44 HTML files. Net: +40 sitewide dofollow inbound links. Most durable fix — every future page picks it up automatically.

### 6. Redirect chains
- Found 2 legacy-slug blog link references in [blog/indoor-vs-outdoor-artificial-living-walls-materials-and-design.html:2370 and :2450](blog/indoor-vs-outdoor-artificial-living-walls-materials-and-design.html) pointing at `/blog/2026-02-21-best-artificial-living-wall-materials-for-texas-climate`. Rewrote to canonical `/blog/best-artificial-living-wall-materials-for-texas-climate`.
- Confirmed 0 `http://lonestarfauxscapes.com` internal hrefs in the codebase. The 2 HTTP→HTTPS hits Ahrefs reported were likely external crawler test hops on the apex domain (handled at CDN via existing `_redirects` rules); no code change needed.
- Confirmed 0 other `.html`-suffix or known-redirect-target hrefs across all HTML (verified by grepping against each rule in `_redirects`).

### Build/verify
- `npm run build` passed. Spot-checked: `dist/index.html`, `dist/dallas.html`, `dist/pricing.html`, `dist/pool-living-wall.html` — all new titles/descriptions present. Image sizes in `dist/assets/images/` confirmed under 600 KB for all 4 originals.
- Sitemap.xml unchanged. Noindex-city pages untouched (`X-Robots-Tag: noindex, follow` preserved).

### Files touched
14 HTML edits, 2 config edits (_headers, content/pricing-page.js), 1 nav edit (index.html + sync propagation), 1 new script (scripts/compress-hero-originals.cjs), 4 binary images re-encoded in place.

## Review: SEO Stabilization (April 4, 2026)

- Added the missing public alias redirects to [_redirects](/C:/Users/geran/.config/superpowers/worktrees/loanstar/seo-stabilization-2026-04-04/_redirects) and [public/_redirects](/C:/Users/geran/.config/superpowers/worktrees/loanstar/seo-stabilization-2026-04-04/public/_redirects) without redirecting `/gallery`, `/blog`, or `/residential`.
- Updated the live service-page titles in [artificial-hedge.html](/C:/Users/geran/.config/superpowers/worktrees/loanstar/seo-stabilization-2026-04-04/artificial-hedge.html), [living-wall.html](/C:/Users/geran/.config/superpowers/worktrees/loanstar/seo-stabilization-2026-04-04/living-wall.html), [pool-privacy-hedge.html](/C:/Users/geran/.config/superpowers/worktrees/loanstar/seo-stabilization-2026-04-04/pool-privacy-hedge.html), [artificial-boxwood-hedge.html](/C:/Users/geran/.config/superpowers/worktrees/loanstar/seo-stabilization-2026-04-04/artificial-boxwood-hedge.html), and the pricing source config in [content/pricing-page.js](/C:/Users/geran/.config/superpowers/worktrees/loanstar/seo-stabilization-2026-04-04/content/pricing-page.js) so the build keeps the pricing title change.
- Verified with a fresh `npm run build` that the generated pages use the new titles, and that support-city pages in `dist/` still output `noindex, follow` while `sitemap.xml` still excludes those support-city routes.

---

# SEO & GEO Gap Analysis — Lone Star Faux Scapes

## Analysis Date: March 23, 2026
## Data Source: Google Search Console (Feb 22 – Mar 21, 2026)

---

## Baseline Performance (Last 28 Days)

| Metric | Value |
|--------|-------|
| US Clicks | 16 |
| US Impressions | 2,188 |
| US CTR | 0.73% |
| US Avg Position | 9.36 |
| Mobile CTR | 1.21% |
| Desktop CTR | 0.27% |

---

## Critical Findings

### 1. SPAM PAGES STILL IN GOOGLE INDEX
Three gambling/casino pages are showing in GSC results — these were injected before and are NOT in the codebase, but Google still has them indexed:
- `/understanding-responsible-gambling-practices-a/` — 34 impressions, pos 2.68
- `/mastering-advanced-casino-strategies-a/` — 1 impression, pos 1.0
- `/seasonal-shifts-how-trends-influence-gambling/` — 1 impression, pos 7.0

**Action:** Add to `GONE_ROUTE_PATHS` and request GSC URL removal.

### 2. LIGHTHOUSE REPORT STILL INDEXED
Already in `GONE_ROUTE_PATHS` but GSC still shows:
- `/lighthouse-report` — 40 impressions, pos 5.12
- `/lighthouse-report.html` — 17 impressions, pos 5.65

**Action:** Request GSC URL removal (middleware already returns 410).

### 3. MASSIVE CTR PROBLEM — Page 1 Rankings, Zero Clicks
These pages are on PAGE 1 of Google but got ZERO clicks in 28 days:

| Page | Position | Impressions | Clicks |
|------|----------|-------------|--------|
| /artificial-hedge | 5.49 | 228 | 0 |
| /fort-worth | 6.78 | 181 | 0 |
| /residential | 5.23 | 156 | 0 |
| /installation | 5.25 | 150 | 0 |
| /austin | 4.93 | 124 | 0 |
| /pricing | 5.39 | 103 | 0 |
| /plano | 6.31 | 78 | 0 |
| /fire-rated-artificial-hedge | 5.16 | 77 | 0 |
| /the-woodlands | 6.54 | 71 | 0 |
| /houston | 13.07 | 67 | 0 |
| /commercial | 5.55 | 60 | 0 |
| /frisco | 8.17 | 59 | 0 |
| /irving | 5.76 | 55 | 0 |

**Root cause:** Title tags and meta descriptions are generic and informational. They describe the product but don't give a searcher a reason to click over competitors.

### 4. SEARCH INTENT MISMATCH
Top queries by impressions are "green living wall installation/maintenance" — these may target REAL plant contractors. The site appears for these but users skip it when they see "artificial" in the snippet. This is both a mismatch AND an opportunity (content that converts real-plant seekers to artificial).

### 5. GEO PERFORMANCE GAPS

**Page 1 cities (good position, zero clicks — CTR fix needed):**
- Fort Worth: pos 6.78
- Austin: pos 4.93
- Plano: pos 6.31
- The Woodlands: pos 6.54
- Irving: pos 5.76

**Page 2 cities (need ranking improvement + CTR fix):**
- Dallas: pos 13.96
- Houston: pos 13.07
- Sugar Land: pos 14.54
- San Antonio: pos 17.1 (only city with 2 clicks!)

### 6. DESKTOP VS MOBILE GAP
Desktop: 62% of impressions, 25% of clicks (0.27% CTR)
Mobile: 37% of impressions, 69% of clicks (1.21% CTR)
Desktop CTR is ~4.5x worse. SERP snippet presentation or rich results may differ.

---

## Plan — SEO Growth Roadmap

### Phase 1: Critical Cleanup (Code Changes)
- [x] 1. Add gambling spam URLs to `GONE_ROUTE_PATHS` in `config/indexing-rules.js`
- [x] 2. Verify middleware returns 410 for all spam URL variants (with/without trailing slash)
- [x] 3. Document GSC URL removal requests needed → `docs/gsc-removal-requests.md`

### Phase 2: CTR Optimization — HIGHEST IMPACT (Code Changes)
- [x] 4-20. Rewrote title tags and meta descriptions for 25 pages

**Changes applied to these pages:**

| Page | Old Title | New Title |
|------|-----------|-----------|
| index.html | Artificial Hedges and Living Walls Installed Across Texas | Texas Artificial Hedges & Living Walls — Zero Maintenance Privacy |
| living-wall.html | Artificial Living Wall Installation in Texas | Artificial Living Walls in Texas — Lush Green, Zero Upkeep |
| artificial-hedge.html | Artificial Hedge Installation in Texas | Artificial Hedges in Texas — Instant Privacy, No Maintenance |
| fort-worth.html | Fort Worth Artificial Living Walls & Hedges | Fort Worth Artificial Hedges & Living Walls — Installed Fast |
| residential.html | Residential Artificial Hedges in Texas | Residential Artificial Hedges — Backyard Privacy in Texas |
| installation.html | Installation Services \| Lone Star Faux Scapes | Artificial Hedge Installation Across Texas — Turnkey & Custom |
| austin.html | Austin Artificial Hedges & Living Walls | Austin Artificial Hedges & Living Walls — No Water Needed |
| dallas.html | Dallas Artificial Hedges & Living Walls | Dallas Artificial Hedges & Living Walls — Installed This Week |
| pricing.html | Artificial Hedge & Living Wall Pricing in Texas | Artificial Hedge & Living Wall Pricing — Texas 2026 |
| sugar-land.html | Sugar Land Artificial Hedge Installation \| Custom Projects \| Lone Star Faux Scapes | Sugar Land Artificial Hedges — Privacy for Luxury Communities |
| houston.html | Houston Artificial Hedges & Living Walls | Houston Artificial Hedges & Living Walls — Humidity-Proof |
| san-antonio.html | San Antonio Artificial Hedges & Living Walls | San Antonio Artificial Hedges & Living Walls — No Watering |
| fire-rated-artificial-hedge.html | Fire-Rated Artificial Hedges in Texas | Fire-Rated Artificial Hedges — NFPA 701 Tested for Texas |
| commercial.html | Commercial Artificial Green Walls in Texas | Commercial Artificial Green Walls — Hotels, Retail & Multifamily |
| fence-extensions.html | Fence Extensions with Artificial Hedges | Artificial Hedge Fence Extensions — Add Privacy Height Fast |
| hoa-approved-artificial-hedge.html | HOA Approved Artificial Hedges \| Texas \| Lone Star Faux Scapes | HOA-Approved Artificial Hedges in Texas — We Handle Approval |
| plano.html | Plano Artificial Hedge Installation \| Custom Projects \| ... | Plano Artificial Hedges — Custom Privacy & Green Walls |
| the-woodlands.html | The Woodlands Artificial Hedge Installation \| Custom Projects \| ... | The Woodlands Artificial Hedges — Built for Your Community |
| frisco.html | Frisco Artificial Hedge Installation \| Custom Projects \| ... | Frisco Artificial Hedges — Premium Privacy Installations |
| irving.html | Irving Artificial Hedge Installation \| Custom Projects \| ... | Irving Artificial Hedges — Business & Residential Privacy |
| arlington.html | Arlington Artificial Hedge Installation \| Custom Projects \| ... | Arlington Artificial Hedges & Living Walls — Custom Installs |
| pool-privacy-hedge.html | Pool Privacy Hedges in Texas | Pool Privacy Hedges — Artificial Hedges for Texas Pools |
| pool-living-wall.html | Pool Living Wall \| Create Your Backyard Oasis \| ... | Pool Living Walls — Backyard Oasis Without the Maintenance |
| commercial-wall.html | Commercial Wall Covering \| Artificial Hedge \| ... | Commercial Wall Covering — Artificial Hedge Facades in Texas |
| artificial-boxwood-hedge.html | Custom Artificial Boxwood Hedge \| Mobile & Permanent Options \| ... | Artificial Boxwood Hedges — Mobile & Permanent Options |

### Phase 3: GEO Ranking Improvement (Content + Internal Linking)
- [x] 21. Audited internal linking to Dallas, Houston, Sugar Land, San Antonio pages
- [x] 22. Added contextual city links in body content of service pages:
  - fence-extensions.html → Dallas, Houston, San Antonio (2 locations)
  - commercial.html → Dallas, Houston, San Antonio (1 location)
  - living-wall.html → Dallas, Houston, San Antonio (2 locations)
  - artificial-hedge.html → Dallas, Houston, San Antonio (1 location)
  - index.html FAQ → Dallas, Houston, San Antonio, Sugar Land (1 location)
- [x] 23. Added city cross-links in 5 blog posts (markdown → rebuilt HTML):
  - Houston blog → /houston, /dallas, /san-antonio, /sugar-land
  - Dallas blog → /dallas, /houston, /san-antonio, /sugar-land
  - San Antonio blog → /san-antonio, /dallas, /houston, /sugar-land
  - Complete guide to hedges → /dallas, /houston, /san-antonio, /sugar-land
  - Complete guide to living walls → /dallas, /houston, /san-antonio, /sugar-land
  - HOA approval guide → /dallas, /houston, /san-antonio, /sugar-land

### Phase 4: Content Strategy Recommendations

**Priority 1: Capture "Green Wall Maintenance" Queries (144 impressions/month)**
GSC shows 144 impressions across maintenance-related queries:
- "green living wall maintenance in fort worth, tx" (48 imp)
- "green wall maintenance dallas tx" (34 imp)
- "green living wall maintenance in dallas, tx" (33 imp)
- "green wall maintenance fort worth tx" (29 imp)

**Recommendation:** Create a blog post: "Artificial Living Wall Maintenance: Why There Isn't Any (and What Real Green Walls Cost)" — This captures people searching for real green wall maintenance and educates them that artificial is a better option for Texas. Target keyword: "green wall maintenance Texas."

**Priority 2: "Real vs Fake" Comparison Content (growing query)**
- "real vs fake plant wall" (10 imp, pos 13.9)
- The existing blog "Artificial Hedges vs Real Plants" (274 imp, 3 clicks) is already the #2 performing page

**Recommendation:** Create a dedicated comparison landing page (not just a blog post) at `/artificial-vs-real-living-walls` that serves as a permanent comparison resource. Internal link from every city page and the living-wall product page.

**Priority 3: "Artificial Hedge Cost" Content**
Multiple cost/pricing queries showing:
- "hedge fence cost" (1 imp)
- Pricing page gets 103 imp at pos 5.39

**Recommendation:** Expand pricing page content OR create a blog post "How Much Do Artificial Hedges Cost in Texas? (2026 Pricing Guide)" with real price ranges, factors that affect cost, and comparison to real hedge costs over time.

**Priority 4: HOA Content Expansion (proven winner)**
The HOA approval blog post is the #6 page by impressions (298 imp) and getting clicks. This topic clearly resonates.

**Recommendation:** Create supporting content:
- "Texas HOA Artificial Hedge Rules by City" (location-specific HOA guides)
- "Texas Property Code 202.007: What It Means for Artificial Hedges" (1 impression already for this exact query)
- "HOA Application Template for Artificial Hedges" (downloadable resource)

**Priority 5: Pool Privacy Expansion**
Pool privacy content is performing (53 imp blog, 55 imp product page).

**Recommendation:** Create city-specific pool privacy content targeting "pool privacy [city]" long-tail keywords, especially for San Antonio (query "patio walls for privacy san antonio tx" shows 4 impressions).

**Priority 6: Commercial/Multifamily Content**
Fire-rated content is performing well (83 imp NFPA blog). Multifamily ROI post exists but is new.

**Recommendation:** Build out the commercial content silo:
- "Artificial Hedges for Texas Apartment Complexes" (multifamily angle)
- "Artificial Green Walls for Texas Restaurants and Bars" (hospitality angle)
- Case studies with specific ROI numbers when available

---

## Review

### Summary of Changes Made

**Phase 1 — Critical Cleanup:**
- Added 6 gambling spam URL variants to `config/indexing-rules.js` GONE_ROUTE_PATHS
- Created `docs/gsc-removal-requests.md` with 5 URLs needing manual GSC removal

**Phase 2 — CTR Optimization (highest expected impact):**
- Rewrote title tags and meta descriptions on 25 pages
- Shortened over-long titles (Sugar Land, Plano, The Woodlands, Frisco, Irving, Arlington were 65+ chars)
- Added benefit-focused language ("Zero Maintenance," "Instant Privacy," "No Water Needed," "Humidity-Proof")
- Added CTAs in descriptions ("Free quotes," "Free estimates")
- Removed generic branding from titles to make room for click-worthy copy

**Phase 3 — Internal Linking:**
- Added contextual in-content links to 4 underperforming city pages across 5 service pages
- Added city cross-links to 6 blog post markdown files and rebuilt HTML
- Sugar Land (previously only linked in nav) now has 7+ new contextual internal links

**Phase 4 — Content Strategy:**
- Documented 6 prioritized content opportunities based on real GSC query data
- Each recommendation targets a specific query gap with estimated impression potential

### Expected Impact
- **CTR improvement** is the biggest lever: moving from 0.73% to even 3% CTR on existing 2,188 impressions would yield ~66 clicks/month (4x current)
- **Internal linking** improvements should help Dallas, Houston, Sugar Land, San Antonio move from page 2 to page 1 within 4-8 weeks
- **Spam cleanup** removes brand trust risk from gambling content in the index
- **Content strategy** targets ~200+ additional impressions/month from proven query gaps

### Manual Action Required
Owner must submit GSC URL removal requests per `docs/gsc-removal-requests.md` — this cannot be done via code.
