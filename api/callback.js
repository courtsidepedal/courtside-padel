// Vercel serverless function — second leg of the GitHub OAuth handshake.
// GitHub redirects here with a ?code=..., we exchange it for an access
// token, then post that token back to the Decap CMS popup window using
// the exact postMessage protocol Decap's github backend expects.

export default async function handler(req, res) {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;
  const { code, state } = req.query;

  if (!clientId || !clientSecret) {
    res.status(500).send(
      'Missing GITHUB_OAUTH_CLIENT_ID / GITHUB_OAUTH_CLIENT_SECRET environment variables. See docs/cms-setup.md.'
    );
    return;
  }

  if (!code) {
    res.status(400).send('Missing OAuth code from GitHub.');
    return;
  }

  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error || !tokenData.access_token) {
      res.status(400).send(`GitHub OAuth error: ${tokenData.error_description || tokenData.error || 'unknown error'}`);
      return;
    }

    const provider = state || 'github';
    const payload = JSON.stringify({ token: tokenData.access_token, provider });

    // This exact handshake — an "authorizing:<provider>" message followed
    // by "authorization:<provider>:success:<payload>" — is what Decap CMS's
    // popup listener is waiting for. Don't rename these strings.
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(`
      <!doctype html>
      <html>
        <body>
          <script>
            (function() {
              function receiveMessage() {
                window.opener.postMessage(
                  'authorization:${provider}:success:${payload.replace(/'/g, "\\'")}',
                  '*'
                );
                window.removeEventListener('message', receiveMessage, false);
              }
              window.addEventListener('message', receiveMessage, false);
              window.opener.postMessage('authorizing:${provider}', '*');
            })();
          </script>
          Login successful — you can close this window.
        </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send(`OAuth callback failed: ${err.message}`);
  }
}
