export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).end();

  const { p, api_key, ...rest } = req.query;
  const path = String(p || '');
  if (!/^[a-z0-9_\/-]+$/i.test(path)) return res.status(404).json({ error: 'not found' });

  const key = process.env.TMDB_KEY || '71b247b86f7dcf7c43e273f24bd3a580';
  const target = new URL('https://api.themoviedb.org/3/' + path);
  Object.entries(rest).forEach(([k, v]) => target.searchParams.set(k, v));
  target.searchParams.set('api_key', key);

  const r = await fetch(target);
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  res.status(r.status).setHeader('Content-Type', 'application/json').send(await r.text());
}
