module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const KEY = process.env.TMDB_KEY || '71b247b86f7dcf7c43e273f24bd3a580';
  const { path = '', ...rest } = req.query;
  const p = Array.isArray(path) ? path.join('/') : path;

  const params = new URLSearchParams(rest);
  params.set('api_key', KEY);

  try {
    const r = await fetch(`https://api.themoviedb.org/3/${p}?${params}`);
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e) {
    res.status(502).json({ error: 'Proxy failed', detail: String(e) });
  }
};
