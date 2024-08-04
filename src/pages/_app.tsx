import { AppProps } from "next/app";
import Head from "next/head";
import { FC, useState } from "react";
import { ContextProvider } from "../contexts/ContextProvider";
import { AppBar } from "../components/AppBar";
import { Footer } from "../components/Footer";
import Notification from "../components/Notification";
import { AirdropView, ContactView, CreateView, DonateView, TokenMetadata } from "views";

require("@solana/wallet-adapter-react-ui/styles.css");
require("../styles/globals.css");

const App: FC<AppProps> = ({ Component, pageProps }) => {
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [openTokenMetaData, setOpenTokenMetaData] = useState<boolean>(false);
  const [openContact, setOpenContact] = useState<boolean>(false);
  const [openAirdrop, setOpenAirdrop] = useState<boolean>(false);
  const [openSendTransaction, setOpenSendTransaction] =
    useState<boolean>(false);
  return (
    <div className="bg-default-900">
      <Head>
        <title>tokenForge</title>
      </Head>
      <ContextProvider>
        <Notification />
        <AppBar
          setOpenCreateModal={setOpenCreateModal}
          setOpenTokenMetaData={setOpenTokenMetaData}
          setOpenContact={setOpenContact}
          setOpenAirdrop={setOpenAirdrop}
          setOpenSendTransaction={setOpenSendTransaction}
        />

        {openCreateModal && (
          <div className="new_loader relative h-full backdrop-blur-md">
            <CreateView setOpenCreateModal={setOpenCreateModal} />
          </div>
        )}

        {openTokenMetaData && (
          <div className="new_loader relative h-full backdrop-blur-sm">
            <TokenMetadata setOpenTokenMetaData={setOpenTokenMetaData} />
          </div>
        )}
        {openContact && (
          <div className="new_loader relative h-full backdrop-blur-sm">
            <ContactView setOpenContact={setOpenContact} />
          </div>
        )}
        {openAirdrop && (
          <div className="new_loader relative h-full backdrop-blur-sm">
            <AirdropView setOpenAirdrop={setOpenAirdrop} />
          </div>
        )}
        {openSendTransaction && (
          <div className="new_loader relative h-full backdrop-blur-sm">
            <DonateView setOpenSendTransaction={setOpenSendTransaction} />
          </div>
        )}

        <Component {...pageProps} />
        <Footer />
      </ContextProvider>

      {/*//SCRIPTS */}
      <script src="assets/libs/preline/preline.js"></script>
      <script src="assets/libs/swiper/swiper-bundle.min.js"></script>
      <script src="assets/libs/lucide/lucide.min.js"></script>
      <script src="assets/libs/gumshoejs/gumshoe.polyfills.min.js"></script>
      <script src="assets/libs/aos/aos.js"></script>
      <script src="assets/js/swiper.js"></script>
      <script src="assets/js/theme.js"></script>
    </div>
  );
};

export default App;
