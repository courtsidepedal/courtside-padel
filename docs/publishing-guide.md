# Publishing a new article — no code required

This is the guide for the site owner. Everything below happens in your
browser, through the CMS — you never need to touch code or Git.

## Log in

1. Go to `https://your-domain.com/admin/`
2. Click **Login with GitHub** and authorize with your GitHub account.

## Publish a racket or shoe review

1. Click **Racket & Gear Reviews** in the left sidebar → **New Racket & Gear Reviews**.
2. Fill in the fields:
   - **Title, Brand, Category, Level** — the basics shown at the top of the page and in cards.
   - **Homepage rank** — only set this to `1`, `2`, or `3` if you want this review
     to appear in the "Top rated rackets" grid on the homepage. Leave it blank
     otherwise. Only one review should hold each number at a time.
   - **Product image** — upload a photo. See the image note below.
   - **Weight / Balance / Shape / Best for** — these fill the spec table.
   - **Pros & cons** — add as many bullet points as you like in each list.
   - **Verdict** — one or two sentences; this shows in a highlighted callout on the page.
   - **Retailer** — pick which retailer this product links to. The actual link
     is built automatically from the retailer's info in **Settings** — you
     never paste a full affiliate URL here.
   - **Retailer product path** — just the part of the URL after the retailer's
     domain, e.g. `/bullpadel-vertex-04`.
   - **Meta description** — one sentence describing the page for Google search
     results. Keep it under ~155 characters.
   - **Review body** — the main write-up. Use `##` at the start of a line to
     create a heading.
3. Set **Draft** off when you're ready to publish (it's on a separate toggle
   near the bottom — leave it checked while you're still writing).
4. Click **Publish** (or **Save** to keep working on it later as a draft).

## Publish a comparison ("X vs Y")

1. Click **Comparisons (X vs Y)** → **New Comparison**.
2. Pick **Racket A** and **Racket B** — these are pulled from your existing
   racket reviews, so publish both reviews first.
3. Add a verdict row for each type of player you want to address (e.g.
   "Beginners," "Aggressive attackers") — pick the winner and write a short note.
4. Fill in the meta description and publish, same as a review.

## Publish a guide

1. Click **Guides** → **New Guide**.
2. Fill in **Title, Tag, Excerpt**.
3. Toggle **Feature on homepage** if you want it in the "Start here" strip
   (only the 3 most recent featured guides show there).
4. Write the body using `##` headings — these automatically become the
   table of contents on the page.

## Updating an affiliate link sitewide

If a retailer changes their affiliate program URL, you don't need to edit
every article:

1. Click **Settings** → **Affiliate Retailers**.
2. Find the retailer, update its **Base URL** or **Affiliate query string**.
3. Save. Every review and comparison linking to that retailer updates
   automatically on the next deploy (a minute or two after you save).

## About images

Upload images at roughly 1600px wide if you can, and compress them first
(a free tool like [squoosh.app](https://squoosh.app) takes 30 seconds). The
site doesn't auto-compress uploaded images, so a smaller file means a
faster-loading page.

## What happens after you click Publish

The CMS commits your change to GitHub, and Vercel automatically rebuilds
and redeploys the site — this usually takes 1–2 minutes. You can watch the
page go live by refreshing it.
