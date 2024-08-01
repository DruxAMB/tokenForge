import { useRouter } from 'next/router';
import { FC, useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import TradingViewWidget from 'components/TradingView';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Transaction } from '@solana/web3.js';
import { notify } from 'utils/notifications';

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
  const { connection } = useConnection();
  const { publicKey, sendTransaction} = useWallet();
  const [buyAmount, setBuyAmount] = useState('');
  const [sellAmount, setSellAmount] = useState('');

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


  const handleBuy = useCallback(async () => {
    if (!publicKey || !buyAmount) return;

    try {
      // Perform the buy transaction logic here
      const transaction = new Transaction();
      // Add transaction instructions for buying tokens
      const signature = await sendTransaction(transaction, connection);
      notify({ type: 'success', message: 'Buy transaction successful', txid: signature });
    } catch (error) {
      console.error('Buy transaction error:', error);
      notify({ type: 'error', message: 'Buy transaction failed' });
    }
  }, [publicKey, buyAmount, connection, sendTransaction]);

  const handleSell = useCallback(async () => {
    if (!publicKey || !sellAmount) return;

    try {
      // Perform the sell transaction logic here
      const transaction = new Transaction();
      // Add transaction instructions for selling tokens
      const signature = await sendTransaction(transaction, connection);
      notify({ type: 'success', message: 'Sell transaction successful', txid: signature });
    } catch (error) {
      console.error('Sell transaction error:', error);
      notify({ type: 'error', message: 'Sell transaction failed' });
    }
  }, [publicKey, sellAmount, connection, sendTransaction]);



  if (loading) {
    return <p>Loading...</p>;
  }

  if (!data) {
    return <p>Data not found</p>;
  }

  return (
    <div className="p-4">
      <div>
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

        <div className='mt-4'>
          <h2 className="text-xl font-bold">Trade {data.symbol}</h2>
          <div className='mt-2'>
            <label>
              Buy Amount:
              <input
                type="number"
                value={buyAmount}
                onChange={(e) => setBuyAmount(e.target.value)}
                className="ml-2 p-1 border rounded"
              />
            </label>
            <button onClick={handleBuy} className="ml-2 p-2 bg-green-500 text-white rounded">Buy</button>
          </div>

          <div className="mt-2">
            <label>
              Sell Amount:
              <input
                type="number"
                value={sellAmount}
                onChange={(e) => setSellAmount(e.target.value)}
                className="ml-2 p-1 border rounded"
              />
            </label>
            <button onClick={handleSell} className="ml-2 p-2 bg-red-500 text-white rounded">Sell</button>
          </div>

        </div>
      </div>
     
      <div>
        <TradingViewWidget symbol={data.symbol}/>
      </div>
    </div>
  );
};

export default TradeDetail;
