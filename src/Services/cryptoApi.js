import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Headers مستعملين env
const cryptoApiHeaders = {
  'x-rapidapi-host': process.env.REACT_APP_CRYPTO_RAPIDAPI_HOST,
  'x-rapidapi-key': process.env.REACT_APP_CRYPTO_RAPIDAPI_KEY,
};

// دالة صغيرة باش نعملو request
const createRequest = (url) => ({ url, headers: cryptoApiHeaders });

export const cryptoApi = createApi({
  reducerPath: 'cryptoApi',

  // baseQuery يستعمل URL من env
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_CRYPTO_API_URL,
  }),

  endpoints: (builder) => ({
    getCryptos: builder.query({
      query: (count) => createRequest(`/coins?limit=${count}`),
    }),

    getCryptoDetails: builder.query({
      query: (coinId) => createRequest(`/coin/${coinId}`),
    }),

    getCryptoHistory: builder.query({
      query: ({ coinId, timeperiod }) =>
        createRequest(`/coin/${coinId}/history?timeperiod=${timeperiod}`),
    }),

    // Exchanges (Note: Premium plan)
   getExchanges: builder.query({
      query: () => ({
        url: 'https://api.coingecko.com/api/v3/exchanges',
        method: 'GET',
      }),
      transformResponse: (response) => {
        console.log('🔥 Raw API Response:', response);
        return response;
      },
    }),
  }),
});

// Export ديال hooks باش نستعملهم فـ Components
export const {
  useGetCryptosQuery,
  useGetCryptoDetailsQuery,
  useGetExchangesQuery,
  useGetCryptoHistoryQuery,
} = cryptoApi;
