import React, { useEffect, useState } from 'react';

const NewsList = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => setNews(data.articles))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Latest Crypto News</h2>
      {news.length === 0 ? (
        <p>Loading news...</p>
      ) : (
        news.map((item, index) => (
          <div key={index}>
            <a href={item.url} target="_blank" rel="noreferrer">
              <h3>{item.title}</h3>
            </a>
            <p>{item.description}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default NewsList;
