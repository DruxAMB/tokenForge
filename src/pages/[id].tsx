import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useState } from "react";
import axios from "axios";
import TradingViewWidget from "components/TradingView";
import Link from "next/link";
import { MdArrowBack } from "react-icons/md";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import { notify } from "utils/notifications";

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
  const { publicKey, sendTransaction } = useWallet();
  const [buyAmount, setBuyAmount] = useState("");
  const [sellAmount, setSellAmount] = useState("");

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

  const handleBuy = useCallback(async () => {
    if (!publicKey || !buyAmount) return;

    try {
      // Perform the buy transaction logic here
      const transaction = new Transaction();
      // Add transaction instructions for buying tokens
      const signature = await sendTransaction(transaction, connection);
      notify({
        type: "success",
        message: "Buy transaction successful",
        txid: signature,
      });
    } catch (error) {
      console.error("Buy transaction error:", error);
      notify({ type: "error", message: "Buy transaction failed" });
    }
  }, [publicKey, buyAmount, connection, sendTransaction]);

  const handleSell = useCallback(async () => {
    if (!publicKey || !sellAmount) return;

    try {
      // Perform the sell transaction logic here
      const transaction = new Transaction();
      // Add transaction instructions for selling tokens
      const signature = await sendTransaction(transaction, connection);
      notify({
        type: "success",
        message: "Sell transaction successful",
        txid: signature,
      });
    } catch (error) {
      console.error("Sell transaction error:", error);
      notify({ type: "error", message: "Sell transaction failed" });
    }
  }, [publicKey, sellAmount, connection, sendTransaction]);

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
        <TradingViewWidget data={data} />
        <div className="col-span-2 grid gap-5">
          <div className="grid gap-5 font-bold">
            <h2 className="text-xl font-bold">Trade ${data.symbol}</h2>
            <div className="">
              <label>
                Buy Amount:
                <input
                  type="number"
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(e.target.value)}
                  className="border-default-200 text-xs lg:text-sm block w-full rounded border-white/10 bg-transparent p-3 text-white/80 focus:border-white/25 focus:ring-transparent"
                />
              </label>
              <button
                onClick={handleBuy}
                className="p-3 w-full bg-green-500 text-white rounded"
              >
                Buy
              </button>
            </div>

            <div className="">
              <label>
                Sell Amount:
                <input
                  type="number"
                  value={sellAmount}
                  onChange={(e) => setSellAmount(e.target.value)}
                  className="border-default-200 text-xs lg:text-sm block w-full rounded border-white/10 bg-transparent p-3 text-white/80 focus:border-white/25 focus:ring-transparent"
                />
              </label>
              <button
                onClick={handleSell}
                className="p-3 w-full bg-red-500 text-white rounded"
              >
                Sell
              </button>
            </div>
          </div>
          <div className="grid gap-3">
            <h1 className="text-2xl font-bold">{data.name}</h1>
            <p>Symbol: {data.symbol}</p>
            <p>Supply: {data.supply}</p>
            <p>Description: {data.description}</p>
            <p>
              Website:{" "}
              <a
                className="text-blue-600 hover:underline"
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
                className="text-blue-600 hover:underline"
                href={data.twitter_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {data.twitter_link}
              </a>
            </p>
            <p>
              Telegram:{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
                href={data.telegram_link}
              >
                {data.telegram_link}
              </a>
            </p>
            <p>
              Discord:{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
                href={data.discord_link}
              >
                {data.discord_link}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeDetail;
