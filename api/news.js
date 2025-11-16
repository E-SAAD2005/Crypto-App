import fetch from 'node-fetch';

export default async function handler(req, res) {
  const apiKey = process.env.REACT_APP_NEWSAPI_KEY;
  const url = `https://newsapi.org/v2/everything?q=cryptocurrency&sortBy=publishedAt&pageSize=10&apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
}
