import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_KEY = '85e97ae7457b4fd093944ff6d56aadd6'; 

const baseUrl = 'https://newsapi.org/v2';

export const cryptoNewsApi = createApi({
  reducerPath: 'cryptoNewsApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getCryptoNews: builder.query({
      query: ({ newsCategory, count }) => ({
        url: '/everything',
        params: {
          q: newsCategory,
          apiKey: API_KEY,
          pageSize: count || 50,
          language: 'en',
          sortBy: 'publishedAt'
        }
      }),
      transformResponse: (response) => {
        console.log('NewsAPI Response:', response);
        
        if (response?.articles && Array.isArray(response.articles)) {
          return {
            data: response.articles.map(article => ({
              name: article.title,
              url: article.url,
              image: { 
                thumbnail: { 
                  contentUrl: article.urlToImage
                } 
              },
              description: article.description || article.content,
              provider: [{
                name: article.source?.name || 'Unknown',
                image: { 
                  thumbnail: { 
                    contentUrl: ''
                  } 
                }
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