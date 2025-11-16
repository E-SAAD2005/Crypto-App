import React from 'react';
import { useGetCryptosQuery } from '../Services/cryptoApi';
import millify from 'millify';

const CryptoList = () => {
  const { data, isFetching } = useGetCryptosQuery(10);
  const coins = data?.data?.coins;

  if (isFetching) return <p>Loading...</p>;

  return (
    <div>
      <h2>Top Cryptocurrencies</h2>
      {coins.map(coin => (
        <div key={coin.uuid}>
          <strong>{coin.rank}. {coin.name}</strong> - ${millify(coin.price)}
        </div>
      ))}
    </div>
  );
};

export default CryptoList;
