# Owner needs: Lone Star rebuild

One batch of questions. Nothing here blocks the build. Until you answer an item, the site uses its **default**: either the claim is left out, or a placeholder is clearly marked and never shipped.

Reply by number. "Drop it" is always a valid answer.

| # | Question | What the site says today | Default until you answer |
|---|---|---|---|
| 1 | Brand spelling. One of: "Lone Star Faux Scapes", "LoneStar Fauxscapes", "Lone Star Fauxscapes". Logo files? | All three spellings, plus "LSFS". Text wordmark and a favicon only. | "Lone Star Faux Scapes", as a text wordmark |
| 2 | Legal entity for Texas work. Any licence, registration or insurance to state, with numbers? | "Licensed & Insured", with no number or board | Claim dropped. Footer reads "A Geranium Street USA brand" |
| 3 | Phone: keep (760) 978-7335 or use a Texas line? | 760 number | 760 number (your 2026-10-12 decision) |
| 4 | Publish the Spicewood street address (21933 Briarcliff Dr, Spicewood, TX 78669)? | Street address in schema | Region only ("Texas"), no street address |
| 5 | Hours: Mon to Fri, 8 AM to 4 PM. Correct? | Shown | Left out |
| 6 | "Est. 2019": proof, or drop? Any project count you will stand behind? | "Est. 2019" badge | Both dropped |
| 7 | Texas starting prices | **Answered 2026-10-25:** same structure as Califauxscapes, installation extra. Hedge from $99 / linear ft (6 ft x 12 in), fence extension from $65 / linear ft (3 ft), living wall from $18 / sq ft, privacy wall from $699 / unit (4 x 4 ft). Commercial wall quoted after a site review | Shipped as released |
| 8 | System lineup to sell (privacy wall added 2026-10-25): hedge (boxwood, ficus, oasis, custom), living wall (Single Mat, Vallum FRX, Fluid Design, Oasis), commercial wall covering, fence extensions, pool privacy, fire-rated hedge. Which stay? | All listed | Four homepage systems: hedge, living wall, fence extension, commercial wall / Vallum FRX |
| 9 | Panel module sizes: 20 in hedge mats and 40 in wall mats? | Both appear | Used in estimator maths (the truth audit marks both as sourced). Correct me if wrong |
| 10 | Fire rating documentation: lab, standard, report or certificate. "With every installation" or "on request"? | Conflicting. Also "self-extinguishes within 2 seconds" | "Fire-rated options available", with NFPA 701 vs ASTM E84 explained. No certificate promise |
| 11 | UV rating, warranty terms, lifespan wording | Conflicting (1 yr structural / 3 yr colour; 5 to 8 yrs; 10+ yrs indoors) | No warranty strip and no lifespan numbers |
| 12 | Who installs: in-house crews or partners? Where are panels built? Which metros have crews? | "Dedicated crews in ATX / DFW / HOU / SATX", "no subcontractors" | Left out |
| 13 | Timelines you will commit to (reply time, mobilization, install days) | "Reply within one business day", "24 to 72 hr", "1 to 2 days" | No timelines |
| 14 | Real Texas install photos: location, date, product, client permission. Before/after pairs especially | 10 Texas case photos (Houston x6, Austin x4), plus one Vallum before/after pair | Texas photos captioned only where already documented. California photos uncaptioned. See `IMAGE-PROMPTS.md` |
| 15 | Austin case study: "approx. 1,800 sq ft" on 16 x 130 ft (that is 2,080 sq ft). Which is right? | Conflict | Area left out. Dimensions only |
| 16 | Any Dallas, Fort Worth or San Antonio jobs to add as case studies? | None | Three case studies only |
| 17 | Reviews or testimonials with permission. Google Business Profile status? | None anywhere | No review section |
| 18 | Which metros and suburbs do you actually serve? Which deserve their own page? | "All of Texas"; 5 metro pages indexed, 6 suburb pages | 5 metro hubs. Suburb pages per `REDIRECTS.md` |
| 19 | 15-minute call booking: yes or no? Who takes the calls? | None | No booking |
| 20 | IDs: GA4, Google Ads, Turnstile site key (current: `0x4AAAAAACV8gs7CEDMYDaQu`), Resend sending domain, lead inbox (`TO_EMAIL`) | Partly unconfirmed on production | Reuse the current Turnstile key and `/api/contact` setup. Analytics wired but needs your IDs |
| 21 | Blog CMS: keep Decap CMS, or move posts into the repo as markdown? | Decap at `/admin/` | Posts as markdown in the repo, with Decap kept pointed at the same folder |
| 22 | Blog byline: a named author, or the organization? | Organization | Organization |
| 23 | Approve palette, type and signature motion after the homepage mock | n/a | Build pauses at the mock |
| 24 | Proof for, or approval to drop: -10 dB, 95% HOA-safe, 90+ mph wind, "self-extinguishes within 2 seconds", "one of the largest artificial greenery suppliers in the US" | Some appear on live pages | All dropped |
| 25 | Live-site defects to fix now or at launch: placeholder `tel:+18888888888` on /vallum-frx, internal-note copy on /commercial-resources, placeholder map on /contact, "© 2025" on /vallum-frx, Frisco meta typo | Live | Fixed in the rebuild only. The live site is untouched until you approve |
| 26 | Suburb pages (Plano, Frisco, Irving, Arlington, Sugar Land, The Woodlands): keep as noindex, or 301 into the metro hubs? See `REDIRECTS.md` decision 2 | noindex | Keep noindex |
| 27 | Rename `/case-studies` and `/gallery` to `/projects`? It would cost 5 indexed URLs | `/projects` 301s to `/case-studies` | Keep `/case-studies` |
| 28 | Fold `/commercial-resources` into `/commercial`? | Separate page, with internal notes showing | Keep it, strip the notes |
| 29 | **Live defect:** the Decap CMS at `/admin/` is stuck in a redirect loop (301 to `/admin`, then 308 back) because of the trailing-slash rule in `_redirects`. Fix it on the live site now? | Broken | Fixed in the rebuild only, unless you say fix live |
| 30 | Freestanding privacy wall page: the rebuild adds `/privacy-wall` (today it 301s to `/residential`). OK to turn it into its own page? | 301 to /residential | New page in the rebuild, redirect removed |
