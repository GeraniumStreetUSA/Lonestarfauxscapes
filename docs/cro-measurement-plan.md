# CRO Measurement Plan

## Goal
Increase qualified calls and email/form leads by making contact actions easier to see, easier to use, and easier to measure across the site.

## Scope of this pass
- Standardize quote, phone, and email actions across homepage, pricing, living wall, residential, city pages, blog posts, and case studies.
- Keep the short-form workflow consistent without changing the blog-post publishing flow.
- Add reusable proof sections that push visitors from service and local pages into project profiles and then into contact actions.

## Shared implementation

### UI and behavior
- `cro.css`
  - Shared CTA block styles
  - Shared short quote form styles
  - Sticky mobile CTA
  - Proof-card styles
  - Inline validation styling for quick forms
- `cro.js`
  - CTA click tracking
  - Phone and email click tracking
  - Form-start, form-submit, and form-error tracking
  - Quick quote widget rendering and submission
  - Gallery / case-study journey attribution
  - Sticky mobile CTA behavior
- `case-study-proofs.js`
  - Loads `content/case-studies.json`
  - Renders proof-card sections from seeded case-study content
  - Reuses the same section/card UI across homepage, pricing, service pages, and city pages

## Event model

| Event Name | Trigger | Key Properties | Notes |
| --- | --- | --- | --- |
| `phone_click` | User clicks any `tel:` link on tracked pages | `page_path`, `page_type`, `page_title`, `cta_text`, `cta_context`, `destination` | Used for call visibility and CTA placement analysis. |
| `email_click` | User clicks any `mailto:` link on tracked pages | `page_path`, `page_type`, `page_title`, `cta_text`, `cta_context`, `destination` | Tracks lower-friction lead preference. |
| `cta_click` | User clicks a tracked CTA button or link | `page_path`, `page_type`, `page_title`, `cta_text`, `cta_context`, `cta_variant`, `destination` | Includes pricing, proof-card, fire-doc, HOA, and case-study CTA clicks. |
| `form_start` | First interaction inside a tracked form | `page_path`, `page_type`, `page_title`, `form_name`, `form_context`, `audience`, `service_interest` | Fires once per form instance. |
| `form_submit` | A tracked form submits successfully | `page_path`, `page_type`, `page_title`, `form_name`, `form_context`, `audience`, `service_interest` | No PII is pushed into analytics. |
| `form_submit_error` | A tracked form fails validation or delivery | `page_path`, `page_type`, `page_title`, `form_name`, `form_context`, `audience`, `service_interest`, `reason` | Useful for UX and delivery debugging. |
| `gallery_contact_journey` | A user clicks a contact action after starting from gallery or case-study content | `page_path`, `page_type`, `page_title`, `source_path`, `source_label`, `destination`, `cta_text` | Set via session storage after a gallery/project click. |

## Naming rules
- Event names follow `object_action`.
- Context belongs in properties, not the event name.
- CTA-specific meaning belongs in `cta_variant`.
- No PII should be added to event properties.

## Standard properties

### Page properties
- `page_path`
- `page_type`
- `page_title`

### CTA properties
- `cta_text`
- `cta_context`
- `cta_variant`
- `destination`

### Form properties
- `form_name`
- `form_context`
- `audience`
- `service_interest`
- `reason` on error only

### Journey properties
- `source_path`
- `source_label`
- `destination`

## Page coverage

| Page Type | Coverage |
| --- | --- |
| Homepage (`/`) | Hero quote/call actions, shared CRO block, reusable proof section, sticky mobile CTA. |
| Pricing (`/pricing`) | Ballpark CTA block, proof section, phone/email visibility, short quote widget, sticky mobile CTA. |
| Residential (`/residential`) | CTA block, HOA path, recent-work path, short quote widget, proof section, sticky mobile CTA. |
| Living wall (`/living-wall`) | CTA block, fire-doc path, recent-work path, short quote widget, proof section, sticky mobile CTA. |
| Core city pages (`/austin`, `/dallas`, `/houston`, `/san-antonio`, `/fort-worth`) | Local CTA block, phone/email visibility, fire-doc path, short quote widget, proof section, sticky mobile CTA. |
| Blog posts (`/blog/*`) | Intent-aware CTA block, phone/email visibility, short quote widget, sticky mobile CTA. |
| Contact page (`/contact`) | Correct Turnstile payload, tracked form, sticky mobile CTA suppressed to avoid distraction. |
| Gallery (`/gallery`) | Source attribution for later contact actions. |
| Case studies (`/case-studies`, `/case-studies/*`) | Source attribution plus direct quote/call/email actions on case-study detail pages. |

## Implemented CTA patterns

### High-intent
- `Get ballpark pricing`
- `Request pricing`
- `Request [city] pricing`
- `Request living wall pricing`
- `Request residential pricing`

### Micro-commitment
- `Request fire-doc info`
- `See recent local work`
- `Ask about HOA-friendly options`
- `Email your project`
- Proof-card clicks into project profiles

### Trust-reducing context near CTA
- `Fast install planning`
- `Custom fit and fabrication`
- `Fire-rated options available`
- City-specific relevance on local pages
- Honest "recent Texas install snapshot" language where no local proof is published yet

## Case-study proof sections
- Proof sections use `data-lsfs-case-studies` placeholders on static pages.
- `case-study-proofs.js` renders cards from `content/case-studies.json`.
- Proof-card clicks are measured through the existing `cta_click` event model.
- This keeps case-study promotion consistent without hardcoding separate card systems into each page.

## Existing forms
- Homepage form remains custom and still submits through the current contact pipeline.
- Contact page form remains custom and now submits `turnstileToken` and `location` correctly.
- Quick quote widgets now mark invalid fields visually before submission.

## Analytics vendor / ops follow-up

### In-repo status
- The repo now emits a stable event model and reusable CTA system.
- The repo still does not define a production analytics destination by itself.

### Still needed outside the repo
1. Confirm GA4 or GTM is installed on production pages.
2. Register conversion events as needed:
   - `phone_click`
   - `email_click`
   - `form_submit`
   - `gallery_contact_journey`
3. Validate events in GA4 DebugView or GTM Preview on production.
4. Decide whether `phone_click` and `email_click` are primary or secondary conversions.

## QA checklist
- `phone_click` fires from hero, CTA blocks, sticky mobile CTA, and proof-card follow-up paths where phone links appear.
- `email_click` fires from CTA blocks and email links.
- `cta_click` fires for pricing, proof-card, fire-doc, HOA, and recent-work actions.
- `form_start` fires once per form instance.
- `form_submit` fires on successful homepage, contact, and quick quote submissions.
- `form_submit_error` fires on validation or delivery failures.
- `gallery_contact_journey` fires after a gallery or case-study click leads to a later contact action.
- Quick-form validation visually marks missing or invalid fields.
- Sticky mobile CTA hides on the contact page and near inline quote sections.
- No SMS/text CTA was added because the repo does not show a supported SMS workflow.
