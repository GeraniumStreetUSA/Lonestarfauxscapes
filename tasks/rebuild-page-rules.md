# Page rules for the full-site rebuild

Every agent building pages reads this first. The homepage (`app/src/pages/HomePage.tsx`) is the quality bar: same type, palette, drawing language and motion. Inner pages must look like the same site, not a template kit.

## Hard owner rules
- No em-dash (U+2014) anywhere: copy, code, comments, alt text. Use commas, colons, parentheses or a new sentence.
- Never invent a fact. If the old page states something not in `CLAIMS.md` as "ok" and not covered by `docs/truth-audit.md`, leave it out (or hedge it into a general, non-numeric statement).
- Prices: only from `app/src/data/starting-prices.ts` via its format helpers, always with `INSTALLATION_CAVEAT`. Never write a dollar figure anywhere else (a test enforces it). Commercial wall is "quoted after a site review". Old prices ("$2,500+ installed", "$25-$65 per sq ft", "$65 to $90", per-panel figures) are dropped.
- Fire: NFPA 701 only for Lone Star's own products ("fire-rated options are built for NFPA 701; ask for the NFPA 701 documentation for the exact system"). Never say or imply Lone Star products have ASTM E84 results. Exception: the blog post `nfpa-701-vs-astm-e84-fire-ratings-for-artificial-greenery` keeps its general explainer of both standards (owner decision 2026-11-04) but no line may tie ASTM E84 results to our products.
- Drop unless sourced (OWNER-NEEDS defaults): licence/"Licensed & Insured", "Est. 2019", project counts, warranties, lifespans ("5 to 8 years", "10+ years"), timelines ("24-72 hr", "1-2 days", "reply within one business day"), crews/"no subcontractors", "-10 dB"/acoustic or noise reduction numbers, "95% HOA-safe", "90+ mph", "self-extinguishes within 2 seconds", "one of the largest suppliers", reviews/ratings, street address, hours.
- Phone (760) 978-7335, email info@lonestarfauxscapes.com, "A Geranium Street USA brand". Brand spelling: "Lone Star Faux Scapes" everywhere (fix "LoneStar Fauxscapes", "LSFS").
- Process (owner, 2026-10-28): send your numbers; we email an assessment and a rough quote (with a 3D render when it helps); a site review sets the final invoice; build; install.
- Photos: only real photos already in the repo; never generate images. Texas install photos may be captioned with their place only when documented (the three case studies). Other photos stay uncaptioned. If a slot has no good real photo, use a plan drawing instead, and add a line to `IMAGE-PROMPTS.md`.

## SEO (these pages already rank; do not lose anything)
- Path, `<title>` and meta description stay as in the route manifest (copied from the live page). Do not rewrite them.
- Keep the H1's main keyword and the old page's main H2 topics where they are truthful, so the page still answers the same queries. Restructure and rewrite copy freely otherwise; cut fluff.
- Exactly one H1. Headings in order (no skipped levels).
- Internal links: systems link to metros and related systems; metros link to systems, local guides/posts and local projects; posts link to their system and metro pages. Plain `<a href>` with slashless paths, never through a redirect (no `.html`, no trailing slash, no `/index.html`).
- FAQ: only visible questions go into FAQPage schema, built from the same array the page renders.
- Every `<img>` has `src`, `width`, `height`, `alt` (use `<Picture>`).

## Voice
Plain, specific, calm. Short sentences. Talk to a homeowner or a property manager in Texas. No hype words ("premium", "elevate", "transform", "stunning", "seamless", "unparalleled"). Answer first, then detail.

## Phones are as important as desktop
- Design every block at 390 px first, then make it sing at 1440.
- Phone page-length budget (at 390x844): system and use-case pages about 8 screens, metro pages about 7, hubs about 6, utility pages as short as their content. Posts are as long as their content, with the table of contents folded.
- No sideways swipe carousels, no horizontal page scroll. 44 px tap targets. Body text at least 16 px.
- Long lists on phones: compact rows or tap-to-open (details/summary), never a wall of cards.
- Every page ends in the quote section or a quote band; the sticky Call/Quote bar is on every page.

## Motion
Use the existing gates (`motionAllowed()`), never leave content at inline `opacity: 0`, nothing depends on motion, `?qa=1` and reduced motion get the final state. The page-level reveals (headings, callouts, photos, accordions) already run from the Layout; don't add competing effects.

## Code
- Match the homepage's code style and comment density. Keep things simple.
- Nothing reads `window`/`document` during render (pages are server-rendered then hydrated).
- No `<style>` in components. Page CSS goes in the CSS file named in your brief (plain CSS, no `@layer`, no `@apply`).
- Run `npm run typecheck`, `npm test`, `npm run build` before reporting.
