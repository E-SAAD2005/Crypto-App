import React, { useState } from 'react';
import HTMLReactParser from 'html-react-parser';
import { useParams } from 'react-router-dom';
import millify from 'millify';
import { Col, Row, Typography, Select } from 'antd';
import { 
  MoneyCollectOutlined, 
  DollarCircleOutlined, 
  FundOutlined, 
  ExclamationCircleOutlined, 
  StopOutlined, 
  TrophyOutlined, 
  CheckOutlined, 
  NumberOutlined, 
  ThunderboltOutlined 
} from '@ant-design/icons';

import { useGetCryptoDetailsQuery, useGetCryptoHistoryQuery } from '../Services/cryptoApi';
import Loader from './Loader';
import LineChart from './LineChart';

const { Title, Text } = Typography;
const { Option } = Select;

const CryptoDetails = () => {
  const { coinId } = useParams();
  const [timeperiod, setTimeperiod] = useState('7d');
  const { data, isFetching, error } = useGetCryptoDetailsQuery(coinId);
  const { data: coinHistory, isFetching: historyFetching, error: historyError } = useGetCryptoHistoryQuery({ 
    coinId, 
    timeperiod 
  });
  
  console.log('=== DEBUG ===');
  console.log('coinId:', coinId);
  console.log('data:', data);
  console.log('coinHistory:', coinHistory);
  console.log('error:', error);
  console.log('historyError:', historyError);
  
  const cryptoDetails = data?.data?.coin;
  
  if (isFetching) return <Loader />;
  if (error) return <div>Error loading data: {error.message}</div>;
  if (!cryptoDetails) return <div>No data available</div>;

  const time = ['3h', '24h', '7d', '30d', '1y', '3m', '3y', '5y'];

  const stats = [
    { 
      title: 'Price to USD', 
      value: cryptoDetails?.price ? `$ ${millify(cryptoDetails.price)}` : 'N/A', 
      icon: <DollarCircleOutlined /> 
    },
    { 
      title: 'Rank', 
      value: cryptoDetails?.rank || 'N/A', 
      icon: <NumberOutlined /> 
    },
    { 
      title: '24h Volume', 
      value: cryptoDetails?.['24hVolume'] ? `$ ${millify(cryptoDetails['24hVolume'])}` : 'N/A', 
      icon: <ThunderboltOutlined /> 
    },
    { 
      title: 'Market Cap', 
      value: cryptoDetails?.marketCap ? `$ ${millify(cryptoDetails.marketCap)}` : 'N/A', 
      icon: <DollarCircleOutlined /> 
    },
    { 
      title: 'All-time-high (daily avg.)', 
      value: cryptoDetails?.allTimeHigh?.price ? `$ ${millify(cryptoDetails.allTimeHigh.price)}` : 'N/A', 
      icon: <TrophyOutlined /> 
    },
  ];

  const genericStats = [
    { 
      title: 'Number Of Markets', 
      value: cryptoDetails?.numberOfMarkets || 'N/A', 
      icon: <FundOutlined /> 
    },
    { 
      title: 'Number Of Exchanges', 
      value: cryptoDetails?.numberOfExchanges || 'N/A', 
      icon: <MoneyCollectOutlined /> 
    },
    { 
      title: 'Approved Supply', 
      value: cryptoDetails?.supply?.confirmed ? <CheckOutlined /> : <StopOutlined />, 
      icon: <ExclamationCircleOutlined /> 
    },
    { 
      title: 'Total Supply', 
      value: cryptoDetails?.supply?.total ? `$ ${millify(cryptoDetails.supply.total)}` : 'N/A', 
      icon: <ExclamationCircleOutlined /> 
    },
    { 
      title: 'Circulating Supply', 
      value: cryptoDetails?.supply?.circulating ? `$ ${millify(cryptoDetails.supply.circulating)}` : 'N/A', 
      icon: <ExclamationCircleOutlined /> 
    },
  ];
console.log('Links:', cryptoDetails?.links);

  return (
    <>
      <Col className='coin-detail-container'>
        <Col className='coins-heading-container'>
          <Title level={2} className="coin-name">
            {cryptoDetails.name} ({cryptoDetails.symbol}) Price
          </Title>
          <p>
            {cryptoDetails.name} live price in US Dollar (USD). View value statistics, market cap and supply.
          </p>
        </Col>

        <Select 
          defaultValue="7d" 
          className='select-timeperiod' 
          placeholder="Select Timeperiod" 
          onChange={(value) => setTimeperiod(value)}
        >
          {time.map((date) => <Option key={date}>{date}</Option>)}
        </Select>

        {historyFetching ? (
          <Loader />
        ) : (
          <LineChart 
            coinHistory={coinHistory} 
            currentPrice={cryptoDetails?.price ? millify(cryptoDetails.price) : '0'} 
            coinName={cryptoDetails.name}
          />
        )}

        <Col className='stats-container'>
          <Col className='coin-value-statistics'>
            <Col className='coin-value-statistics-heading'>
              <Title level={3} className="coin-detail-heading">
                {cryptoDetails.name} Value Statistics
              </Title>
              <p>
                An overview showing the statistics of {cryptoDetails.name}, such as the base and quote currency, the rank, and trading volume.
              </p>
            </Col>
            {stats.map(({ icon, title, value }, index) => (
              <Col className='coin-stats' key={index}>
                <Col className='coin-stats-name'>
                  <Text>{icon}</Text>
                  <Text>{title}</Text>
                </Col>
                <Text className="stats">{value}</Text>
              </Col>
            ))}
          </Col>

          <Col className='other-stats-info'>
            <Col className='coin-value-statistics-heading'>
              <Title level={3} className="coin-detail-heading">
                Other Stats Info
              </Title>
              <p>
                An overview showing the statistics of {cryptoDetails.name}.
              </p>
            </Col>
            {genericStats.map(({ icon, title, value }, index) => (
              <Col className='coin-stats' key={index}>
                <Col className='coin-stats-name'>
                  <Text>{icon}</Text>
                  <Text>{title}</Text>
                </Col>
                <Text className="stats">{value}</Text>
              </Col>
            ))}
          </Col>
        </Col>

         <Col className="coin-desc-link">
        <Row className="coin-desc">
          <Title level={3} className="coin-details-heading">What is {cryptoDetails.name}?</Title>
          {(cryptoDetails.description)}
        </Row>
        
        <Col className="coin-links">
          <Title level={3} className="coin-details-heading">{cryptoDetails.name} Links</Title>
          {cryptoDetails.links?.map((link) => (
            <Row className="coin-link" key={link.name}>
              <Title level={5} className="link-name">{link.type}</Title>
              <a href={link.url} target="_blank" rel="noreferrer">{link.name}</a>
            </Row>
          ))}
        </Col>
        </Col>
      </Col>
    </>
  );
}

export default CryptoDetails;