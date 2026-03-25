# Blog Internal Linking

## Goal

Turn each article into a helpful part of the buying journey instead of a dead-end post.

## What Changed

- The blog index now acts as a hub, not just a reverse-chronological archive.
- Each blog post now gets:
  - a mid-article support block
  - a stronger end-of-article support block
  - related article cards
  - derived links to matching service pages, city pages, pricing, and commercial resources when relevant
- Topic support is derived from existing frontmatter and article text, so the autoblogger does not need a new required field.

## Current Topic Model

- `artificial-hedges`
- `living-walls`
- `commercial-planning`
- `local-guides`

These are inferred from existing fields first:

- `category`
- `tags`
- `title`
- `summary`
- optional `city`

Optional future overrides are supported in frontmatter, but not required:

- `topic`
- `audience`
- `city`
- `servicePage`
- `featured`

## Internal Linking Rules

Every new post should include, either through article copy or the generated support blocks:

- 1 primary service-page link
- 1 pricing or planning link
- 1 audience link when relevant
- 1 city-page link when the article has real local intent
- 2 to 3 related article links

## Service Link Rules

- Hedge/privacy posts should point to `/artificial-hedge` unless a tighter page is more relevant.
- Pool privacy posts should prefer `/pool-privacy-hedge`.
- HOA posts should prefer `/hoa-approved-artificial-hedge`.
- Living wall posts should prefer `/living-wall`.
- Fire-rated hedge posts can prefer `/fire-rated-artificial-hedge`.
- Commercial/specifier posts should point to `/commercial` and often `/commercial-resources`.
- Residential homeowner posts should point to `/residential`.

## City Link Rules

Only link to city pages when the article has actual local relevance.

Good triggers:

- the title names a city
- frontmatter includes `city`
- the article is clearly about one of the main Texas metros

Current preferred city pages:

- `/austin`
- `/dallas`
- `/houston`
- `/san-antonio`
- `/fort-worth`

Do not force suburb links into generic articles.

## Anchor Style Rules

Use readable anchors that help the user decide where to click next.

Preferred patterns:

- `See ballpark pricing`
- `See artificial living wall installs`
- `See the Dallas city page`
- `Request fire-doc and spec help`
- `See recent local work`

Avoid:

- exact-match keyword stuffing
- repeated anchors with the same wording in one article
- vague anchors like `click here`

## Featured Guide Rules

Featured guides should be evergreen or high-intent pieces, such as:

- complete guides
- pricing/cost posts
- major compliance/fire-standard explainers
- strong planning guides tied to real buyer questions

## Future Content Checklist

Before publishing a new blog post, confirm:

- title and summary are specific
- category is set
- tags are useful and human-readable
- city is included only when real local intent exists
- the article naturally supports at least one service page
- the article can point to pricing, a city page, or commercial resources when relevant

## Maintenance Notes

- Blog hub sections are generated from `scripts/build-blog.js`.
- The blog index shell is `blog.html`.
- Generated post data is written to `content/posts.json`.
- Individual posts are written to `blog/*.html`.

This keeps the autoblogger workflow intact because existing markdown remains the source of truth.
