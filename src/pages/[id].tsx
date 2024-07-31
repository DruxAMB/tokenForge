import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';
import axios from 'axios';

interface TokenData {
  creator_address: string;
  token_address: string;
  name: string;
  symbol: string;
  supply: string;
  description: string;
  website_link: string;
  twitter_link: string;
  telegram_link: string;
  discord_link: string;
}

const TradeDetail: FC = () => {
  const router = useRouter();
  const { id } = router.query; // This is the token address or identifier
  const [data, setData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // Fetch data from the API
      axios.get('https://pump.truevastdata.com/api/v1/tokens')
        .then((response) => {
          const tokenData = response.data;
          // Find the token data based on the token address or identifier
          const token = tokenData.find((item: TokenData) => item.token_address === id);
          setData(token);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!data) {
    return <p>Data not found</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{data.name}</h1>
      <p>Symbol: {data.symbol}</p>
      <p>Supply: {data.supply}</p>
      <p>Description: {data.description}</p>
      <p>
        Website: <a href={data.website_link} target="_blank" rel="noopener noreferrer">{data.website_link}</a>
      </p>
      <p>
        Twitter: <a href={data.twitter_link} target="_blank" rel="noopener noreferrer">{data.twitter_link}</a>
      </p>
      <p>Telegram: {data.telegram_link}</p>
      <p>Discord: {data.discord_link}</p>
    </div>
  );
};

export default TradeDetail;
