# Current Task: SEO Stabilization (April 4, 2026)

- [x] Add missing redirect aliases for `/projects`, `/get-quote`, `/privacy-policy`, and `/fire-rated` in both redirect files.
- [x] Keep `/gallery`, `/blog`, and `/residential` live in this phase.
- [x] Normalize titles on `artificial-hedge.html`, `living-wall.html`, `pricing.html`, `pool-privacy-hedge.html`, and `artificial-boxwood-hedge.html`.
- [x] Build the site and verify updated titles in `dist/`.
- [x] Verify support-city pages still emit `noindex, follow` and stay out of the sitemap.

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
