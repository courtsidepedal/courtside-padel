# Website build brief — Courtside Padel (working name)

## Project overview
Build a fast, static content/affiliate website reviewing and comparing padel rackets, shoes, and gear. The site earns revenue through affiliate links to padel retailers (PadelNuestro, Casas Padel, Padel And Help, etc.) and eventually display ads. Target audience: English-speaking padel players (beginner to advanced) worldwide, researching gear purchases.

Non-negotiable constraints:
- Must load fast (static output, no heavy JS frameworks client-side)
- Must be editable by a non-technical owner going forward, without touching code for routine content publishing
- Must run on a near-zero monthly budget (free/near-free hosting)

## Tech stack
- **Framework:** Astro — static site generator, outputs pure HTML/CSS at build time. Project already scaffolded.
- **CMS layer:** Decap CMS or TinaCMS, integrated so the site owner can create/edit articles through a simple browser form (title, body, images, affiliate links, spec fields) — no Git or code required for daily use. Not yet set up.
- **Hosting:** Already live on Vercel (auto-deploys from the `main` branch on every push — no setup needed here)
- **Repo:** github.com/courtsidepedal/courtside-padel — clone this, don't start from scratch
- **Domain:** to be purchased separately (Namecheap/Cloudflare) and connected to the Vercel project

## Content types / templates needed
1. **Homepage** — hero section, "top rated rackets" grid (ranked cards with spec rows), a "start here" guides section, footer
2. **Racket/gear review template** — single-product review page with: spec table (weight, balance, shape, level, price), pros/cons, verdict, affiliate CTA button, related comparisons
3. **Comparison template** ("X vs Y") — side-by-side spec table, verdict per player type
4. **How-to / guide template** — standard long-form article layout with table of contents for longer posts
5. **Category/hub pages** — e.g. "All racket reviews," "All shoe reviews"

## Reference mockups (attached — build to match, don't reinterpret)
Four static HTML mockups define the exact visual system and are the source of truth for styling — treat written descriptions below as backup, not the primary spec:
1. `padel-homepage-mockup.html` — homepage
2. `padel-racket-review-template.html` — single racket review page
3. `padel-comparison-template.html` — "X vs Y" comparison page
4. `padel-category-hub-template.html` — "All racket reviews" hub/listing page
5. `padel-guide-article-template.html` — long-form how-to guide article

## Design direction
- **Tone:** bold, energetic, athletic — not corporate, not soft/pastel
- **Palette:** warm off-white/paper background (~#FAF8F5), near-black ink (~#171412) for text/structure, a strong orange-red court accent (~#E8532B) as the single primary accent color, a muted yellow "ball" tone (~#E8C93A) used sparingly (e.g. rank badges)
- **Typography:** bold condensed display face for headlines (e.g. Anton), clean sans for body (e.g. Inter), monospace for specs/data (e.g. IBM Plex Mono) to signal "real testing data," not generic blog copy
- **Signature element:** a recurring "court-line" divider between sections — a thick black bar with a short orange segment and a dot, echoing a padel court's service line marking. Use this instead of generic spacing or numbered section markers.
- A working homepage mockup (HTML/CSS) will be provided as a visual reference — match its direction, do not deviate into a generic template look.

## Functional requirements
- SEO fundamentals: clean URLs, meta title/description fields editable per page, sitemap.xml, fast Core Web Vitals
- Affiliate link management: links should be easy to update sitewide if a program URL changes (centralized config, not hardcoded per article)
- Comparison tables and spec tables must be a reusable component, not manually coded per article
- Fully responsive, mobile-first (majority of traffic will be mobile)
- Image optimization (auto-resize/compress on build)

## Out of scope for v1
- User accounts / logins
- Comments
- E-commerce checkout (all purchases happen off-site via affiliate links)

## Deliverables
1. All five templates above built into the existing Astro codebase, matching the reference mockups
2. Custom domain connected to the existing Vercel project
3. CMS configured and tested — owner must be able to create a new article end-to-end without developer help
4. Brief written or recorded walkthrough of how to publish a new article via the CMS
