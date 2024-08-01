import { useEffect, useRef } from 'react';


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

const TradingViewWidget = ({data}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => {
        new (window as any).TradingView.widget({
          autosize: true,
          symbol: data.symbol,
          interval: 'D',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '3',
          locale: 'en',
          toolbar_bg: '#1e293b',
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: 'tradingview_123',
        });
      };

      containerRef.current.appendChild(script);
    }
  }, []);

  return (
    <div
      id="tradingview_123"
      ref={containerRef}
      className='w-full h-80 md:h-96 lg:h-[500px] max-h-full col-span-5'
    ></div>
  );
};

export default TradingViewWidget;