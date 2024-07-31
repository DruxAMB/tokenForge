// TODO: SignMessage
import { useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";
import { FC } from "react";

export const TradeCardDetails: FC = () => {
  const { publicKey, signMessage } = useWallet();
  const handleSubmit = (e: any) => {};

  return (
    <div className="relative h-screen flex items-center justify-center">
      
      <h1 className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-5xl md:text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
        Trading is coming soon.
        <span className="animate-ping text-white">...</span>
      </h1>
    </div>
  );
};
