# Google Search Console — URL Removal Requests

**Date:** March 23, 2026
**Action Required:** Submit temporary removal requests in GSC for all URLs below.
**Steps:** GSC > Removals > New Request > "Remove this URL only" > paste each URL

## Gambling Spam Pages (Priority: CRITICAL)

These were injected before site cleanup and are still indexed despite not existing in the codebase. Middleware now returns 410 Gone for all variants.

1. `https://lonestarfauxscapes.com/understanding-responsible-gambling-practices-a/`
2. `https://lonestarfauxscapes.com/mastering-advanced-casino-strategies-a/`
3. `https://lonestarfauxscapes.com/seasonal-shifts-how-trends-influence-gambling/`

## Stale Internal Pages (Priority: HIGH)

Already returning 410 via middleware but still showing impressions in GSC:

4. `https://lonestarfauxscapes.com/lighthouse-report`
5. `https://lonestarfauxscapes.com/lighthouse-report.html`

## Verification

After submitting removal requests:
- Check back in 24-48 hours to confirm removals are processing
- Monitor GSC Coverage report for any new spam URLs appearing
- If new spam URLs appear, investigate Cloudflare Pages preview deployments and old branch deploys
