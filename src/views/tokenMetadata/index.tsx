import { FC, useState, useCallback } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { Metadata, PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import { AiOutlineClose } from "react-icons/ai";
import { ClipLoader } from "react-spinners";
import { notify } from "../../utils/notifications";
import { InputView } from "../index";

interface TokenMetadataProps {
  setOpenTokenMetaData: (value: boolean) => void;
}

export const TokenMetadata: FC<TokenMetadataProps> = ({
  setOpenTokenMetaData,
}) => {
  const { connection } = useConnection();
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenMetadata, setTokenMetadata] = useState(null);
  const [logo, setLogo] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getMetadata = useCallback(
    async (form) => {
      setIsLoading(true);
      try {
        const tokenMint = new PublicKey(form);
        const metadataPDA = PublicKey.findProgramAddressSync(
          [
            Buffer.from("metadata"),
            PROGRAM_ID.toBuffer(),
            tokenMint.toBuffer(),
          ],
          PROGRAM_ID
        );

        const metadataAccount = await connection.getAccountInfo(metadataPDA[0]);

        if (!metadataAccount) {
          console.log("No metadata account found for this token address.");
          setIsLoading(false);
          notify({ type: "error", message: "No metadata account found" });
          return;
        }

        const metadata = Metadata.deserialize(metadataAccount.data);
        const metadataData = metadata[0].data;

        setTokenMetadata(metadataData);
        setLogo(metadataData.uri);
        setIsLoading(false);
        setLoaded(true);
        setTokenAddress("");
        notify({
          type: "success",
          message: "Successfully fetched token metadata",
        });
        console.log("Successfully fetched token metadata", metadataData);
      } catch (error) {
        console.error("Error fetching metadata:", error);
        notify({ type: "error", message: "Failed to fetch token metadata" });
        setIsLoading(false);
      }
    },
    [connection]
  );

  const CloseModal = () => (
    <a
      onClick={() => setOpenTokenMetaData(false)}
      className="group inline-flex h-10 w-10 items-center justify-center rounded-lg cursor-pointer bg-black hover:bg-slate-900 backdrop-blur-2xl transition-all duration-500"
    >
      <i className="mdi mdi-facebook text-2xl text-white group-hover:text-white">
        <AiOutlineClose />
      </i>
    </a>
  );

  return (
    <>
      {isLoading && (
        <div className="absolute top-0 left-0 z-50 flex h-screen w-full items-center justify-center bg-black/[.3] backdrop-blur-[10px]">
          <ClipLoader />
        </div>
      )}
      <section className="flex items-center py-6 px-0 lg:h-screen lg:p-10">
        <div className="container">
          <div className="bg-default-950/40 mx-auto max-w-5xl overflow-hidden rounded-2xl backdrop-blur-2xl">
            <div>
              {!loaded ? (
                <div className="lg:ps-0 flex h-full flex-col p-10">
                  <div className="my-auto pb-6 text-center">
                    <div className="flex justify-between mb-5">
                      <h4 className="lg:mt-0 text-lg md:text-2xl font-bold text-white">
                        Link to your Token
                      </h4>
                      <CloseModal />
                    </div>
                    <p className="text-default-300 mx-auto mb-5 max-w-sm">
                      Paste your <b>token address</b> to access your metadata
                    </p>
                    <div className="mt-5 w-full text-center">
                      <p className="text-default-300 text-base font-medium leading-6"></p>
                      <InputView
                        name="Token Address"
                        placeholder="address"
                        clickhandle={(e) => setTokenAddress(e.target.value)}
                      />

                      <div className="mb-6 text-center">
                        <button
                          onClick={() => getMetadata(tokenAddress)}
                          className="bg-gradient-to-tr from-[#9945FF] to-[#14F195] hover:from-[#9945ffb7]  hover:to-[#14f195b2] group mt-5 inline-flex w-full items-center justify-center rounded-lg px-6 py-2 text-white backdrop-blur-2xl transition-all duration-500"
                        >
                          <span className="fw-bold">Get Token MetaData</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="lg:ps-0 w-96 max-w-5xl flex h-full flex-col p-10">
                  <div className="my-auto pb-6 text-center">
                    <div className="flex justify-between mb-5">
                      <h4 className="lg:mt-0 text-2xl font-bold text-white">
                        Token Metadata
                      </h4>
                      <CloseModal />
                    </div>
                    <div className="mt-5 w-full text-center">
                      <p className="text-default-300 text-base font-medium leading-6"></p>
                      <InputView
                        name="Token Name"
                        placeholder={tokenMetadata?.name}
                        clickhandle={() => {}}
                      />

                      <InputView
                        name="Symbol"
                        placeholder={tokenMetadata?.symbol || "undefined"}
                        clickhandle={() => {}}
                      />
                      <InputView
                        name="Token URI"
                        placeholder={tokenMetadata?.uri}
                        clickhandle={() => {}}
                      />

                      <div className="mb-6 text-center">
                        <a
                          href={tokenMetadata?.uri}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-gradient-to-tr from-[#9945FF] to-[#14F195] hover:from-[#9945ffb7]  hover:to-[#14f195b2] group mt-5 inline-flex w-full items-center justify-center rounded-lg px-6 py-2 text-white backdrop-blur-2xl transition-all duration-500"
                        >
                          <span className="fw-bold">Open URI</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
