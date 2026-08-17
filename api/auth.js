// Vercel serverless function — first leg of the GitHub OAuth handshake
// that Decap CMS needs to let the site owner log in and publish.
//
// This exists because Decap CMS's "github" backend normally expects an
// OAuth provider at Netlify (via `git-gateway`). This site is on Vercel,
// so this function + api/callback.js stand in for that piece. Requires
// GITHUB_OAUTH_CLIENT_ID and GITHUB_OAUTH_CLIENT_SECRET to be set as
// Vercel environment variables — see docs/cms-setup.md.

export default function handler(req, res) {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;

  if (!clientId) {
    res.status(500).send(
      'Missing GITHUB_OAUTH_CLIENT_ID environment variable. See docs/cms-setup.md.'
    );
    return;
  }

  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const redirectUri = `${protocol}://${req.headers.host}/api/callback`;

  const authorizeUrl = new URL('https://github.com/login/oauth/authorize');
  authorizeUrl.searchParams.set('client_id', clientId);
  authorizeUrl.searchParams.set('redirect_uri', redirectUri);
  authorizeUrl.searchParams.set('scope', 'repo,user');
  authorizeUrl.searchParams.set('state', 'github');

  res.writeHead(302, { Location: authorizeUrl.toString() });
  res.end();
}
