# One-time setup: GitHub, Vercel, and the CMS login

This is the technical setup a developer does once. After this, the site owner
never touches any of it again — see `docs/publishing-guide.md` for their side.

## 1. Push this project to GitHub

```bash
cd courtside-padel
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/courtside-padel.git
git push -u origin main
```

## 2. Deploy to Vercel

1. In Vercel, "Add New Project" → import the GitHub repo you just pushed.
2. Framework preset: Vercel auto-detects Astro. Leave build settings as default
   (`npm run build`, output directory handled by the Vercel adapter).
3. Deploy. You'll get a `*.vercel.app` URL to start.
4. Once you're ready, connect the real domain under Project → Settings → Domains.

## 3. Update the site URL in two places

Once you know the final domain, replace `https://courtsidepadel.com` in:

- `astro.config.mjs` (`site:` — used for the sitemap and canonical URLs)
- `public/admin/config.yml` (`base_url` and `site_url` / `display_url`)

Commit and push — Vercel redeploys automatically.

## 4. Set up GitHub login for the CMS

The CMS (`/admin`) needs a way to log the site owner in with their GitHub
account so it can commit content changes on their behalf. This site uses a
small self-hosted OAuth handshake (`api/auth.js` + `api/callback.js`) instead
of Netlify's built-in login service, since it's hosted on Vercel.

1. In GitHub: **Settings → Developer settings → OAuth Apps → New OAuth App**.
   - **Homepage URL**: your production domain, e.g. `https://courtsidepadel.com`
   - **Authorization callback URL**: `https://courtsidepadel.com/api/callback`
2. GitHub gives you a **Client ID** and lets you generate a **Client secret**.
3. In Vercel: Project → Settings → Environment Variables, add:
   - `GITHUB_OAUTH_CLIENT_ID`
   - `GITHUB_OAUTH_CLIENT_SECRET`
4. Redeploy so the new environment variables take effect.
5. Update `repo:` in `public/admin/config.yml` to your actual `owner/repo`.

## 5. Set up the contact form

The Contact page posts to [Formspree](https://formspree.io) (free tier,
no backend code to maintain) rather than a custom serverless function —
this keeps the site fully static and the setup to a couple of minutes.

1. Create a free account at [formspree.io](https://formspree.io) and add a
   new form. Point its notification email at whoever should receive
   submissions (e.g. `hello@courtsidepadel.com`).
2. Copy the form ID Formspree gives you — it's the last segment of the
   endpoint URL, `https://formspree.io/f/XXXXXXXX`.
3. In `src/pages/contact/index.astro`, replace `YOUR_FORM_ID` with that ID.
4. Commit and push. Submit a test message through the live contact page to
   confirm it arrives.

## 6. Give the site owner access

The owner needs push access to the GitHub repo (as a collaborator, or on the
same org/team) since the CMS commits on their behalf using their own GitHub
login. Add them as a collaborator on the repo before they try to log in.

## 7. Test it

Visit `https://your-domain.com/admin/`, click "Login with GitHub," authorize
the OAuth app, and confirm you land in the CMS with the Rackets, Comparisons,
Guides, and Settings collections visible.

---

### A note on image handling

CMS-uploaded images land in `public/images/uploads` and are automatically
resized (capped at 1600px wide) and recompressed in place on every build,
via `scripts/optimize-images.mjs` (runs as the `prebuild` npm script, needs
no configuration). It tracks what it's already processed in a small
manifest file next to the uploads, so rebuilding repeatedly doesn't
re-compress — and re-degrade — the same image over and over. The owner
doesn't need to do anything differently; whatever they upload through the
CMS ships optimized.
