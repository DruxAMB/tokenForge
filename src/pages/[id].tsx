import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import axios from "axios";
import TradingViewWidget from "components/TradingView";
import Link from "next/link";
import { MdArrowBack } from "react-icons/md";

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
      axios
        .get("https://pump.truevastdata.com/api/v1/tokens")
        .then((response) => {
          const tokenData = response.data;
          // Find the token data based on the token address or identifier
          const token = tokenData.find(
            (item: TokenData) => item.token_address === id
          );
          setData(token);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center py-28 px-5">
        <p className="text-center font-bold text-2xl">
          Loading.<span className="animate-ping">...</span>
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-screen flex justify-center items-center py-28 px-5">
        <p className=" text-center font-bold text-2xl">
          Data not found :({" "}
          <Link href={"/"}>
            <a className="underline animate-pulse">got back</a>
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen py-28 px-5 ">
      <Link href={"/"}>
        <div className="flex gap-2 mb-5 animate-pulse cursor-pointer">
          <MdArrowBack className="" />
          <a className="underline">go back</a>
        </div>
      </Link>
      <div className="md:grid gap-5 md:grid-cols-7">
        <TradingViewWidget />
        <div className="col-span-2">
          <h1 className="text-2xl font-bold">{data.name}</h1>
          <p>Symbol: {data.symbol}</p>
          <p>Supply: {data.supply}</p>
          <p>Description: {data.description}</p>
          <p>
            Website:{" "}
            <a
              href={data.website_link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {data.website_link}
            </a>
          </p>
          <p>
            Twitter:{" "}
            <a
              href={data.twitter_link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {data.twitter_link}
            </a>
          </p>
          <p>Telegram: {data.telegram_link}</p>
          <p>Discord: {data.discord_link}</p>
        </div>
      </div>
    </div>
  );
};

export default TradeDetail;
