# Local Page Playbook

## Goal
Make city pages more useful and conversion-focused without turning them into thin doorway pages or fake-location pages.

## Core principles
- Lead with what is installed in that city.
- Tie the city to believable buyer concerns and use cases.
- Use service-area language, not fake office language.
- Only show local proof when it exists.
- If local proof does not exist, say so and use nearby Texas proof honestly.

## Indexation policy
- Core metro pages can be indexable when they have real proof, stronger unique copy, and a clear internal-link role.
- Surrounding suburb pages should not be indexable by default.
- A suburb page should only stay indexable if it has:
  - a genuinely distinct local angle
  - materially different sections or FAQ coverage
  - real local proof or supportable proprietary detail
  - enough value that it would still make sense without the city keyword
- If a suburb page does not meet that bar:
  - keep it live for users if helpful
  - mark it `noindex, follow`
  - remove it from the sitemap
  - route primary planning intent to the closest metro hub

## Recommended page structure
1. Direct H1
   - Example: `Artificial hedges & living walls in Austin, TX`
2. Direct intro
   - Plain English
   - Mention the dominant local use cases
   - Mention one or two supportable technical factors
3. City-specific use cases
   - Hospitality
   - Rooftop privacy
   - Pools
   - Retail frontage
   - Multifamily amenities
   - Choose only the ones that fit the city
4. Relevant service links
   - Link to the best matching service pages
5. Proof block
   - Local project profile if available
   - Otherwise an honest "recent Texas install snapshot" block
6. Local FAQ
   - Use questions that fit the city’s likely buyer concerns
7. Strong CTA
   - Ballpark pricing
   - Call
   - Email
   - Short quote form

## What makes a city page unique
- Different hero intro
- Different dominant use cases
- Different service emphasis
- Different FAQ wording
- Different proof source when available
- Different local language for neighborhoods or property types

## Current proof rules in this repo

### Local proof available
- Austin
- Dallas
- Houston

### No published local proof yet
- San Antonio
- Fort Worth

When local proof is missing, use nearby Texas proof only if the copy clearly says it is a recent Texas or DFW snapshot, not a local case study.

## Schema guidance
- Use `name: "Lone Star Faux Scapes"`
- Use `areaServed` for the city
- Do not imply a physical office unless the repo has a real address to support it
- Keep service descriptions tied to the actual install types offered

## Copy guidance
- Prefer direct language over SEO filler
- Avoid repeating exact city + keyword strings unnaturally
- Use specific concerns:
  - privacy
  - code documentation
  - fire-rated options
  - acoustic control
  - UV stability
  - fast install windows

## CTA guidance
- The primary CTA should usually be `Get ballpark pricing`
- Pair it with:
  - phone
  - email
  - short quote form
- Add a micro-commitment only when supportable:
  - `Request fire-doc info`
  - `See recent local work`
  - `Ask about HOA-friendly options`

## QA checklist for future local pages
- The H1 is direct and city-specific.
- The intro sounds like a human wrote it for that city.
- The page links to matching services.
- Proof is honest and correctly labeled.
- No fake office or address claims appear.
- CTA block includes phone, email, and quote path.
- Schema uses service-area language.
