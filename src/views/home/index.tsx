// };
import { FC } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Pepe from "../../../public/assets/images/ai/pepe.svg";
import Shiba from "../../../public/assets/images/ai/shiba.svg";
import ShibaCoin from "../../../public/assets/images/ai/shiba-back.svg";

interface HomeViewProps {
  setOpenCreateModal: React.Dispatch<React.SetStateAction<boolean>>;
}

import pkg from "../../../package.json";
import { TradeToken } from "components/TradeToken";
import Image from "next/image";

export const HomeView: FC<HomeViewProps> = ({ setOpenCreateModal }) => {
  return (
    <section
      id="home"
      className="relative overflow-hidden pb-20 pt-[72px] bg-slate-900"
    >
      <div className="px-6 py-4">
        <div className="bg-default-950/40 rounded-2xl">
          <div className="container">
            <div className="p-6">
              <div className="relative">
                <div className="bg-primary/10 -z-1 start-0 absolute top-0 h-14 w-14 animate-[spin_10s_linear_infinite] rounded-2xl rounded-br-none rounded-tl-none"></div>
                <div className="-z-1 right-0 absolute top-5 h-10 w-10 md:h-16 md:w-16 animate-[bounce_10s_linear_infinite]">
                  <Image src={Pepe} alt="pepe" height={100} width={100} />
                </div>
                <div className="-z-1 right-10 md:right-80 absolute bottom-5 h-10 w-10 md:h-16 md:w-16 animate-[bounce_8s_linear_infinite]">
                  <Image src={Shiba} alt="pepe" height={100} width={100} />
                </div>

                <div className="bg-primary/20 -z-1 end-0 absolute left-5 bottom-20 h-14 w-14 animate-pulse rounded-full"></div>
                <div className="z-30">
                  <div className="bg-slate-800 w-fit rounded-md">
                    <span className="text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195] bg-slate-850  rounded-md px-3 py-1 text-sm font-md uppercase tracking-wider">
                      tokenForge {pkg.version}
                    </span>
                  </div>

                  <h1 className="md:text-5xl/tight my-4 max-w-lg text-4xl font-bold text-white">
                    Transform your vision into tokens instantly on tokenForge.
                  </h1>
                  <p className="text-default-300 md:text-lg">
                    Launch your Solana token easily with our all-in-one
                    development and deployment solution. Get started quickly on
                    the fast and scalable Solana blockchain.
                  </p>

                  <div className="new_add_css">
                    <a
                      onClick={() => setOpenCreateModal(true)}
                      className="hover:bg-blue-hover cursor-pointer w-fit md:pe-4 group mt-10 inline-flex items-center justify-center gap-2 rounded-full border border-white/10 md:px-1 md:py-1 text-white transition-all duration-500"
                    >
                      <span className="bg-gradient-to-tr from-[#9945FF] to-[#14F195] hover:from-[#9945ffb7]  hover:to-[#14f195b2] text-white me-2 flex h-11 w-11 items-center justify-center rounded-full group-hover:bg-white/10 group-hover:text-white font-bold">
                        +
                      </span>
                      Create
                    </a>
                    <a className="mt-8 rounded-md bg-gradient-to-tr from-[#9945FF] to-[#14F195] hover:from-[#9945ffb7]  hover:to-[#14f195b2]">
                      <WalletMultiButton />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="md:hero mx-auto my-20 p-4">
          <div className="md:hero-content flex flex-col">
            <h1 className="text-center text-2xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
              Trade Token
            </h1>
            <TradeToken />
          </div>
        </div>
      </div>
    </section>
  );
};
