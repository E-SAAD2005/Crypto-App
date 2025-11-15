import React from 'react';
import millify from 'millify';
import { Collapse, Row, Col, Typography, Avatar } from 'antd';
import { useGetExchangesQuery } from '../Services/cryptoApi';
import Loader from './Loader';

const { Text } = Typography;
const { Panel } = Collapse;

const Exchanges = () => {
  console.log('🚀 Exchanges component loaded');
  
  const { data: exchangesList, isFetching, error } = useGetExchangesQuery();

  console.log('📊 isFetching:', isFetching);
  console.log('📦 exchangesList:', exchangesList);
  console.log('❌ error:', error);

  if (isFetching) {
    console.log('⏳ Loading...');
    return <Loader />;
  }

  if (error) {
    console.error('💥 Error:', error);
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3>⚠️ Error loading exchanges</h3>
        <p>{error?.data?.message || error?.error || 'API request failed'}</p>
        <p style={{ fontSize: '12px', color: '#888' }}>
          Tip: CoinGecko API may require a free API key. Visit{' '}
          <a href="https://www.coingecko.com/en/api" target="_blank" rel="noopener noreferrer">
            coingecko.com/api
          </a>
        </p>
      </div>
    );
  }

  if (!exchangesList || exchangesList.length === 0) {
    console.warn('⚠️ No data received');
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3>No exchanges data available</h3>
      </div>
    );
  }

  console.log('✅ Rendering', exchangesList.length, 'exchanges');

  return (
    <>
      <Row style={{ marginBottom: '20px', fontWeight: 'bold', padding: '10px 0' }}>
        <Col span={6}>Exchange</Col>
        <Col span={6}>24h Volume (BTC)</Col>
        <Col span={6}>Trust Score</Col>
        <Col span={6}>Year Established</Col>
      </Row>

      <Row gutter={[0, 16]}>
        {exchangesList.map((exchange) => (
          <Col span={24} key={exchange.id}>
            <Collapse>
              <Panel
                key={exchange.id}
                showArrow={false}
                header={
                  <Row>
                    <Col span={6}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Text><strong>{exchange.trust_score_rank}.</strong></Text>
                        <Avatar 
                          className="exchange-image" 
                          src={exchange.image}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/40?text=' + (exchange.name?.[0] || 'EX');
                          }}
                        />
                        <Text><strong>{exchange.name}</strong></Text>
                      </div>
                    </Col>
                    <Col span={6}>
                      {exchange.trade_volume_24h_btc 
                        ? millify(exchange.trade_volume_24h_btc, { precision: 2 }) 
                        : 'N/A'}
                    </Col>
                    <Col span={6}>
                      {exchange.trust_score ? `${exchange.trust_score}/10` : 'N/A'}
                    </Col>
                    <Col span={6}>
                      {exchange.year_established || 'N/A'}
                    </Col>
                  </Row>
                }
              >
                <div style={{ padding: '10px' }}>
                  <p>
                    <strong>Description:</strong><br />
                    {exchange.description?.trim() 
                      ? exchange.description 
                      : 'No description available for this exchange.'}
                  </p>
                  
                  {exchange.url && (
                    <p>
                      <strong>Website:</strong><br />
                      <a 
                        href={exchange.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: '#1890ff' }}
                      >
                        {exchange.url}
                      </a>
                    </p>
                  )}

                  {exchange.country && (
                    <p><strong>Country:</strong> {exchange.country}</p>
                  )}
                </div>
              </Panel>
            </Collapse>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Exchanges;