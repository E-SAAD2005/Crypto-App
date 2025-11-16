import React, { useState } from 'react';
import { Select, Typography, Row, Col, Avatar, Card, Spin } from 'antd';
import moment from 'moment';

import { useGetCryptosQuery } from '../Services/cryptoApi';
import { useGetCryptoNewsQuery } from '../Services/cryptoNews';

const demoImage = 'https://www.bing.com/th?id=OVFT.mpzuVZnv8dwIMRfQGPbOPC&pid=News';

const { Text, Title } = Typography;
const { Option } = Select;

const News = ({ simplified }) => {
  const [newsCategory, setNewsCategory] = useState('Cryptocurrency');
  const { data } = useGetCryptosQuery(100);
  const { data: cryptoNews, isFetching, error } = useGetCryptoNewsQuery({ 
    newsCategory, 
    count: simplified ? 6 : 50 
  });
  

 

  if (isFetching) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
      <Spin size="large" />
    </div>
  );

  if (error) {
    console.error('API Error:', error);
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Text type="danger">Error loading news: {error.message || 'Please check your API key'}</Text>
      </div>
    );
  }

  if (!cryptoNews?.data || cryptoNews.data.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Text>No news found for "{newsCategory}". Try selecting a different cryptocurrency.</Text>
      </div>
    );
  }

  return (
    <Row gutter={[24, 24]}>
      {!simplified && (
        <Col span={24}>
          <Select
            showSearch
            className="select-news"
            placeholder="Select a Crypto"
            optionFilterProp="children"
            onChange={(value) => setNewsCategory(value)}
            filterOption={(input, option) => 
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            value={newsCategory}
            style={{ width: '100%', maxWidth: '300px' }}
          >
            <Option value="Cryptocurrency">Cryptocurrency</Option>
            {data?.data?.coins?.map((currency) => (
              <Option key={currency.uuid} value={currency.name}>
                {currency.name}
              </Option>
            ))}
          </Select>
        </Col>
      )}
      
      {cryptoNews.data.map((news, i) => (
        <Col xs={24} sm={12} lg={8} key={news.url || i}>
          <Card hoverable className="news-card">
            <a href={news.url} target="_blank" rel="noreferrer">
              <div className="news-image-container">
                <Title className="news-title" level={4}>
                  {news.name}
                </Title>
                <img 
                  style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'cover' }}
                  src={news?.image?.thumbnail?.contentUrl || demoImage} 
                  alt={news.name}
                  onError={(e) => { e.target.src = demoImage; }}
                />
              </div>
              <p>
                {news.description 
                  ? (news.description.length > 100 
                      ? `${news.description.substring(0, 100)}...` 
                      : news.description)
                  : 'No description available'}
              </p>
              <div className="provider-container">
                <div>
                  <Avatar 
                    src={news.provider[0]?.image?.thumbnail?.contentUrl || demoImage} 
                    alt="provider" 
                  />
                  <Text className="provider-name">
                    {news.provider[0]?.name || 'Unknown'}
                  </Text>
                </div>
<Text>{moment(news.datePublished).format(" MMMM Do YYYY")}</Text>
              </div>
            </a>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default News;