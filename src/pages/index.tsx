import { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import {
  HomeView,
  CreateView,
  TokenMetadata,
  ContactView,
  AirdropView,
  DonateView,
} from "../views";

const Home: NextPage = (props) => {
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [openTokenMetaData, setOpenTokenMetaData] = useState<boolean>(false);
  const [openContact, setOpenContact] = useState<boolean>(false);
  const [openAirdrop, setOpenAirdrop] = useState<boolean>(false);
  const [openSendTransaction, setOpenSendTransaction] =useState<boolean>(false);
  return (
    <>
      <Head>
        <title>tokenForge</title>
        <meta name="description" content="Solana token & Nft creator" />
      </Head>
      <HomeView setOpenCreateModal={setOpenCreateModal} />

      {openCreateModal && (
        <div className="new_loader relative h-full   bg-slate-950">
          <CreateView setOpenCreateModal={setOpenCreateModal} />
        </div>
      )}

      {openTokenMetaData && (
        <div className="new_loader relative h-full bg-slate-950">
          <TokenMetadata setOpenTokenMetaData={setOpenTokenMetaData} />
        </div>
      )}
      {openContact && (
        <div className="new_loader relative h-full bg-slate-950">
          <ContactView setOpenContact={setOpenContact} />
        </div>
      )}

      {openAirdrop && (
        <div className="new_loader relative h-full bg-slate-950">
          <AirdropView setOpenAirdrop={setOpenAirdrop} />
        </div>
      )}
      {openSendTransaction && (
        <div className="new_loader relative h-full bg-slate-950">
          <DonateView setOpenSendTransaction={setOpenSendTransaction} />
        </div>
      )}
    </>
  );
};

export default Home;
