"use client";

import { FC } from 'react';
import Image from "next/image";
import Link from "next/link";

interface TradeCardProps {
  data: {
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
  };
}

export const TradeCard: FC<TradeCardProps> = ({ data }) => {
  return (
    <Link href={`/trade/${data.token_address}`} passHref>
      <div
        className="p-2 text-white rounded-sm hover:bg-opacity-75 cursor-pointer"
      >
        <div className="px-2 md:px-10">
          <Image 
            src="/path-to-your-image.jpg" // Replace with a valid image path
            alt="card"
            width={200}
            height={200}
            className="mb-2 w-full rounded-t-xl"
          />
        </div>
        <div className="grid gap-2 bg-gradient-to-tr from-[#9945FF] to-[#14F195] text-white p-2 border border-white rounded-b-xl">
          <p className="font-bold text-center text-sm md:text-lg">
            {data.name}
            <span> : {data.symbol}:</span>
          </p>
          <h1 className="text-xs md:text-sm mx-auto p-1 w-fit border border-t-4 border-white">Created By {data.creator_address}</h1>
          <p className="text-xs md:text-sm">
            Supply: <span className="text-primary">{data.supply}</span>
          </p>
          <p className="text-xs md:text-sm">{data.description}</p>
        </div>
      </div>
    </Link>
  );
};
