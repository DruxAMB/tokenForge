import { FC } from "react";
import Link from "next/link";
import { LuMenu } from "react-icons/lu";
import NetworkSwitcher from "./NetworkSwitcher";

interface FeatureViewProps {
  setOpenTokenMetaData: (value: boolean) => void;
  setOpenContact: (value: boolean) => void;
  setOpenSendTransaction: (value: boolean) => void;
  setOpenAirdrop: (value: boolean) => void;
  setOpenCreateModal: (value: boolean) => void;
}

export const AppBar: FC<FeatureViewProps> = ({
  setOpenTokenMetaData,
  setOpenContact,
  setOpenSendTransaction,
  setOpenCreateModal,
  setOpenAirdrop,
}) => {
  const menu = [
    {
      name: "Create",
      function: setOpenCreateModal,
    },
    {
      name: "Get Metadata",
      function: setOpenTokenMetaData,
    },
    {
      name: "Donate",
      function: setOpenSendTransaction,
    },
    {
      name: "Airdrop",
      function: setOpenAirdrop,
    },
    {
      name: "Contact Us",
      function: setOpenContact,
    },
  ];

  return (
    <div>
      <header id="navbar-sticky" className="bg-slate-850 navbar">
        <div className="container">
          <nav>
            <Link href={"/"}>
              <a className="logo">
                <h1 className="font-bold text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
                  tokenForge
                </h1>
              </a>
            </Link>

            <div className="ms-auto flex items-center px-2.5 lg:hidden">
              <button
                className="hs-collapse-toggle  bg-default-100/5 inline-flex h-9 w-12 items-center justify-center rounded-md border border-white/20"
                type="button"
                id="hs-unstyled-collapse"
                data-hs-collapse="#mobileMenu"
                data-hs-type="collapse"
              >
                <i data-lucide="menu" className="  stroke-white">
                  <LuMenu />
                </i>
              </button>
            </div>

            <div
              id="mobileMenu"
              className="hs-collapse mx-auto mt-2 hidden grow basis-full items-center justify-center transition-all duration-300 lg:mt-0 lg:flex lg:basis-auto"
            >
              <ul id="navbar-navlist" className="navbar-nav">
                {menu.map((list, index) => (
                  <li className=" nav-item" key={index}>
                    <a
                      className="hover:bg-slate-800 nav-link inline-block"
                      onClick={() => list.function(true)}
                    >
                      {list.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
              <NetworkSwitcher />
          </nav>
        </div>
      </header>
    </div>
  );
};
