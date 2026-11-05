# Page templates for the full-site rebuild

Read with `tasks/rebuild-page-rules.md`. Build every page from the kit in `app/src/components/page/` (see `app/src/pages/KitPage.tsx`, dev only at `/__kit`). Phone budget at 390x844 in brackets.

Each page's copy lives in a typed data file (`app/src/data/pages/<slug>.ts`), rendered by one template component per type (`app/src/pages/<Type>Page.tsx`). Routes in `app/src/routes.ts` point `load` at a tiny per-page module so each page is its own chunk.

## System page [about 8 screens]
`/artificial-hedge`, `/living-wall`, `/fence-extensions`, `/commercial-wall`, `/privacy-wall`

1. PageHero: callout (system family), H1 (keep the live H1's keyword), one-sentence lede, released price (`price` id, or 'quoted' for commercial wall), quote button + phone, real photo, FactRows (3 to 4 confirmed specs: panel size, mounting, heights, fire-rated options exist).
2. "What it solves": PointList, 3 to 4 rows, from the old page's benefit sections, claims filtered.
3. EstimatorSection with `initialSystem` (systems the estimator knows; skip for commercial wall).
4. Options: OptionGrid (materials or configurations the old page lists and the truth audit allows: boxwood, ficus, oasis for hedges; living wall mat styles; extension heights).
5. How it installs / how pricing works: short Section; the owner's 5-step process (send numbers, emailed assessment + rough quote with 3D render when it helps, site review sets final invoice, build, install), as compact rows.
6. One project (CardGrid of 1 to 3 case studies that use this system) if one exists.
7. FaqList (the old page's FAQs, claims filtered, 4 to 6) + FAQPage schema.
8. LinkRows: related systems, use-case pages, 5 metros (internal links).
9. QuoteSection (`hasQuoteForm: true`).

## Use-case page [about 7 screens]
`/artificial-boxwood-hedge`, `/fire-rated-artificial-hedge`, `/hoa-approved-artificial-hedge`, `/pool-privacy-hedge`, `/pool-living-wall`, `/vallum-frx`

Like the system page, lighter: hero (price of the parent system), the problem in one Section, PointList of how this setup answers it, OptionGrid only if real options exist, FaqList, LinkRows (parent system, sibling use cases, guides on the same topic), QuoteSection. Fire-rated and Vallum FRX: NFPA 701 only, documentation "for the exact system you choose"; drop warranties/lifespans/"self-extinguishes"/wind numbers. HOA page: cite Texas Property Code Chapter 202 like the homepage, never promise approval; link the two HOA blog posts.

## Metro page [about 7 screens]
`/dallas`, `/fort-worth`, `/houston`, `/austin`, `/san-antonio` (indexed) and `/plano`, `/frisco`, `/irving`, `/arlington`, `/sugar-land`, `/the-woodlands` (noindex, same template, shorter)

1. PageHero: H1 with the city keyword (keep the live H1 meaning), lede about what local projects usually need, actions, media: the TexasMap with this metro's pin active (or a real local photo when one is documented, e.g. Houston and Austin case studies).
2. "What {city} projects usually need": PointList from the old page's local content (claims filtered; no invented local facts, no neighborhoods unless the old page names them and they are plausible general geography).
3. Systems for {city}: OptionGrid/LinkRows to the 5 system pages with the released price lines.
4. Local work: case studies in that city (Houston 2, Austin 1); none elsewhere: skip the block (never fake it).
5. Guides for {city}: LinkRows to the city's blog posts (from the old page's "learn more" links and posts mentioning the city) and the HOA/maintenance guides.
6. FaqList (old page FAQ, filtered) + schema.
7. Nearby: LinkRows to the other metros; suburbs link to their metro.
8. QuoteSection.

## Hub page [about 6 screens]
`/products`, `/residential`, `/commercial`, `/commercial-resources`, `/locations`, `/guides`, `/blog`, `/case-studies`, `/gallery`

PageHero (no price unless the hub is about one system), then the hub's job: CardGrid of its children, plus one or two short Sections carrying the old page's main H2 topics, FaqList if the old page had one, QuoteBand (or QuoteSection on `/residential` and `/commercial`). `/blog` and `/guides` list every post (blog newest first; guides grouped by category with flagship guides first). `/gallery`: a photo grid of the real Texas install photos (two columns on phones, tap to view larger in a simple dialog; no carousel). `/commercial-resources`: strip the internal notes ("No fake download library", "in the repo today").

## Post page
`/blog/<slug>` (34)

Article header: category callout, H1, date (and updated), reading time, summary; hero image; Toc (folded on phones, sticky aside on desktop); flagship guide blocks (quick answers, decision snapshot, comparison matrix: stacked cards on phones, table on desktop); Prose body; related posts (LinkRows or CardGrid); QuoteBand tuned to the post topic (hedge, living wall, commercial/fire, city). Heading ids must stay exactly as generated.

## Project page
`/case-studies/<slug>` (3)

PageHero with the lead photo and FactRows (city, system, dimensions as documented, mount, foliage), the story in short Sections (problem, scope, result), a photo gallery (2 columns on phones), LinkRows to the system and metro pages, QuoteSection.

## Utility pages
- `/contact` [short]: hero with phone, email, "A Geranium Street USA brand", service area line; QuoteSection first-class (`hasQuoteForm: true`); no placeholder map, no hours, no street address.
- `/pricing`: released starting prices only (all four from `starting-prices.ts` + commercial "quoted after a site review"), how pricing is built (cost drivers from the old page, no numbers), the 5-step process, what to send for a quote, QuoteSection. The old "$2,500+ installed" examples go.
- `/installation`: the 5-step process as the main content, what install involves (mounting surfaces), service areas, QuoteBand.
- `/privacy`, `/terms`: Prose, noindex, text carried over with brand spelling fixed and em-dashes removed (no new legal claims).
- `/sitemap`: noindex HTML sitemap generated from the route manifest (grouped).
- `/404`: short, helpful (links to systems, areas, contact), noindex.
- `/hedge-builder-residential`, `/hedge-builder-commercial`: noindex tools that POST to `/hedge-quote`. Rebuild as simple forms with the same field names the old form posts (read `functions/hedge-quote.js` for the contract), in the kit style.
