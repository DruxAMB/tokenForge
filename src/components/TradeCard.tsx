"use client";

import { FC } from "react";
import Image from "next/image";
import Link from "next/link";

interface TradeCardProps {
  data: {
    creator_address: string;
    token_address: string;
    name: string;
    symbol: string;
    supply: string;
    image_url: string;
    description: string;
    website_link: string;
    twitter_link: string;
    telegram_link: string;
    discord_link: string;
  };
}

export const TradeCard: FC<TradeCardProps> = ({ data }) => {
  
  return (
    <Link href={`/${data.token_address}`} passHref>
      <div className="text-white rounded-sm hover:bg-opacity-75 cursor-pointer">
        <div className="md:px-10">
        {data.image_url ? (
        <Image
          src={data.image_url}
          alt="card"
          priority
          width={500}
          height={500}
          className="max-w-[500px] max-h-[500px] rounded-t-xl"
        />
      ) : (
        <p className="h-40 flex items-center justify-center rounded-t-xl bg-slate-700">No image found :(</p>
      )}
        </div>
        <div className="grid gap-2 bg-gradient-to-tr from-[#9945ff49] to-[#14f19531] text-white p-2 border border-white rounded-b-xl">
          <p className="font-bold text-center text-sm md:text-lg">
            {data.name}
            <span> : {data.symbol}</span>
          </p>
          {data.creator_address ? (
            <h1 className="text-xs md:text-sm mx-auto p-1 w-fit border border-t-4 border-white">
              Created By {data.creator_address.slice(0, 6)}
            </h1>
          ) : (
            <h1 className="text-xs md:text-sm mx-auto p-1 w-fit border border-t-4 border-white">
              Created By Unknown
            </h1>
          )}
          <p className="text-xs md:text-sm">
            Supply: <span className="text-primary">{data.supply}</span>
          </p>
          <p className="text-xs md:text-sm">{data.description}</p>
        </div>
      </div>
    </Link>
  );
};
