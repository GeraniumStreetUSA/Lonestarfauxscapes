# Homepage Audit Fix Plan — Bring to 9-10/10

## Fix 2: Remove Dead CSS + Dead Code (~15-20KB savings)
- [x] Remove old `#main-header` CSS from inline styles (~145 lines removed)
- [x] Reposition botanical mark to right side of hero (decorative, z-index 15, opacity 0.35, hidden on mobile)
- [x] Remove GSAP loader script + preconnect to cdnjs.cloudflare.com
- [x] Remove `<meta name="keywords">` tag
- [x] Remove `<meta http-equiv="X-UA-Compatible">` tag

## Fix 3: Add Photos to Path Cards (Commercial / Architect / Residential)
- [x] Add `<picture>` with commercial-3 image to Commercial path card
- [x] Add `<picture>` with living-wall-2 image to Architect/Designer path card
- [x] Add `<picture>` with hedge-privacy-2 image to Residential path card
- [x] Add CSS for path card media (16:9 aspect-ratio, object-fit cover, 12px border-radius)

## Fix 4: Un-hide Water Savings Calculator + Mission Badges
- [x] Changed `#coverage .city-mission` from `display: none` to `margin-top: 2.5rem`

## Fix 5: Add "How It Works" Section + Pricing Anchor
- [x] Added 3-step process section before contact (Share > Fabricate > Install) with numbered circles + arrows
- [x] Added pricing anchor: "Most residential projects land between $25-$65 per square foot installed"

## Other Fixes — SEO
- [x] Fixed `og:type` from `business.business` to `website`
- [x] Aligned title to match H1: "Artificial Hedges & Living Walls Installed Across Texas — Lone Star Faux Scapes"

## Other Fixes — Accessibility / QoL
- [x] Added visible skip-to-content link (hidden off-screen, visible on focus)
- [x] Fixed case study dot touch targets (added 16px padding with background-clip: content-box for 43px total hit area)
- [ ] Hero city links container bleed — investigated, within padding bounds, not broken

## Other Fixes — Wowness / Lasting Appeal
- [x] Path card photos added (covered in Fix 3)
- [x] Removed scroll progress bar HTML from homepage
- [x] Reduced section padding from 8rem to 6rem to tighten gaps
- [x] Fixed footer watermark contrast (switched from rgba color to transparent + text-stroke)

## Other Fixes — Information
- [x] Added Geranium Street USA context: "one of the largest artificial greenery suppliers in the US"

---

## Review

### Summary of Changes
All changes were made to 2 files:
- **index.html**: Dead code removal, botanical mark repositioning, path card images, water calculator un-hidden, how-it-works section, pricing anchor, skip link, meta tag fixes, title alignment, section padding, footer contrast fix, Geranium Street context
- **cro.css**: Case study carousel dot touch target fix (padding + background-clip)

### Lighthouse Results (Desktop)
| Metric | Before | After |
|--------|--------|-------|
| Accessibility | 94 | 97 |
| Best Practices | 96 | 96 |
| SEO | 100 | 100 |
| Failures | 3 | 1* |

*Remaining failure is Turnstile console error (localhost-only, not present in production)

### Inline CSS Reduction
83,410 bytes -> 80,818 bytes (2,592 bytes removed). Further savings available by extracting remaining dead botanical animation keyframes to an external file.

### What's Still Needed (Future)
- Testimonials with real customer quotes (user will add later)
- Extract inline CSS to external cacheable files (larger refactor)
- Performance trace for Core Web Vitals (LCP, CLS, INP)
