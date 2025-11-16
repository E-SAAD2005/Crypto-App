import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = '/api/news';
const API_KEY= process.env.REACT_APP_NEWSAPI_KEY;
export const cryptoNewsApi = createApi({
  reducerPath: 'cryptoNewsApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getCryptoNews: builder.query({
  query: ({ newsCategory, count }) => ({
    url: `?category=${newsCategory}&count=${count}`,
  }),
  transformResponse: (response) => {
    if (response?.articles) {
      return {
        data: response.articles.map(article => ({
          name: article.title,
          url: article.url,
          image: { thumbnail: { contentUrl: article.urlToImage }},
          description: article.description,
          provider: [{
            name: article.source?.name || "Unknown",
            image: { thumbnail: { contentUrl: "" }},
          }],
          datePublished: article.publishedAt
        }))
      };
    }
    return { data: [] };
  }
}),
  }),
});

export const { useGetCryptoNewsQuery } = cryptoNewsApi;