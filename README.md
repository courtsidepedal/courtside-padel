# Courtside Padel

An independent padel gear review and affiliate site. Static Astro build,
content managed through Decap CMS, deployed on Vercel.

## Stack

- **[Astro](https://astro.build)** — static site generator, plain HTML/CSS output
- **[Decap CMS](https://decapcms.org)** — browser-based content editor at `/admin`, backed by GitHub
- **Vercel** — hosting, free tier
- **GitHub** — content storage (every article is a markdown file in `src/content/`)

## Project structure

```
src/
  components/       Reusable UI: Nav, CourtLine, RacketCard, SpecTable, etc.
  layouts/          BaseLayout.astro — shared <head>, nav, footer
  content/          Markdown content — rackets/, comparisons/, guides/
  content.config.ts Content collection schemas (the CMS mirrors this)
  data/
    affiliates.json    Centralized retailer base URLs — edit here, not per-article
    affiliateLink.ts    Builds full affiliate URLs from affiliates.json
  pages/
    index.astro         Homepage
    rackets/            Racket review template + hub page
    shoes/              Shoe hub page (shares the rackets template)
    vs/                 Comparison template + hub page
    guides/             Guide template + hub page
    about/, contact/, affiliate-disclosure/
public/
  admin/            Decap CMS config and entry point
api/
  auth.js, callback.js   GitHub OAuth handshake for the CMS login (Vercel functions)
docs/
  cms-setup.md          One-time developer setup: GitHub, Vercel, OAuth
  publishing-guide.md   How the site owner publishes content — no code
```

## Local development

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # outputs to dist/ and .vercel/output
npm run preview   # serve the production build locally
```

## Deploying

See `docs/cms-setup.md` for the full one-time setup (GitHub push, Vercel
import, OAuth app for CMS login). Every `git push` to `main` after that
auto-deploys.

## Adding content without the CMS (optional, for developers)

Content is just markdown with frontmatter in `src/content/{rackets,comparisons,guides}/`.
You can add or edit files directly and push — the CMS and direct file edits
both work against the same files, so nothing is CMS-locked.

## Design reference

Visual direction, palette, and the "court-line" signature divider come from
the approved homepage mockup (`DOCTYPE_htm1.pdf`) — see `src/styles/global.css`
for the token values.
