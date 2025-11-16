export default async function handler(req, res) {
  const API_KEY = process.env.REACT_APP_NEWSAPI_KEY;

  const { category = "crypto", count = 50 } = req.query;

  const url = `https://newsapi.org/v2/everything?q=${category}&pageSize=${count}&language=en&sortBy=publishedAt&apiKey=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching news" });
  }
}
