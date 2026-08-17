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

## 5. Give the site owner access

The owner needs push access to the GitHub repo (as a collaborator, or on the
same org/team) since the CMS commits on their behalf using their own GitHub
login. Add them as a collaborator on the repo before they try to log in.

## 6. Test it

Visit `https://your-domain.com/admin/`, click "Login with GitHub," authorize
the OAuth app, and confirm you land in the CMS with the Rackets, Comparisons,
Guides, and Settings collections visible.

---

### A note on image handling

CMS-uploaded images are stored in `public/images/uploads` and served as-is —
they are **not** auto-optimized by Astro's build pipeline, because that
pipeline only processes images imported from `src/`, not files dropped into
`public/`. For a near-zero-budget static setup this is a deliberate
trade-off to keep publishing simple for a non-technical owner. Two ways to
tighten this up later if it matters:

- Ask the owner to export images at roughly 1600px wide, compressed
  (e.g. via [Squoosh](https://squoosh.app)), before uploading — takes 30
  seconds per image and covers 90% of the benefit.
- Or, add a build-time image optimization step (e.g. `sharp` run over
  `public/images/uploads` as a Vercel build command) if traffic grows enough
  to justify the added build complexity.
