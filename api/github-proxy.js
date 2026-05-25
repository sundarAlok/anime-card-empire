// Serverless proxy for Vercel to fetch files from a private GitHub repo
// Expects env: GITHUB_TOKEN, GH_OWNER, GH_REPO
export default async function handler(req, res) {
  const filePath = req.query.path;
  if (!filePath) return res.status(400).send('Missing path');

  const owner = process.env.GH_OWNER;
  const repo = process.env.GH_REPO;
  const token = process.env.GITHUB_TOKEN;
  if (!owner || !repo || !token) return res.status(500).send('Server misconfigured');

  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(filePath)}`;

  try {
    const resp = await fetch(apiUrl, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3.raw'
      }
    });

    if (!resp.ok) {
      const text = await resp.text();
      return res.status(resp.status).send(text);
    }

    const arrayBuffer = await resp.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = resp.headers.get('content-type') || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    // short caching on CDN layer
    res.setHeader('Cache-Control', 'private, s-maxage=60, stale-while-revalidate=300');
    return res.status(200).send(buffer);
  } catch (err) {
    return res.status(500).send(err.message || 'Error');
  }
}
