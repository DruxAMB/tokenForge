import React, { FC, useState, useCallback } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  createInitializeMintInstruction,
  getMinimumBalanceForRentExemptMint,
  getAssociatedTokenAddress,
  createMintToInstruction,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import {
  createCreateMetadataAccountV3Instruction,
  PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";
import axios from "axios";

import { notify } from "../../utils/notifications";
import { ClipLoader } from "react-spinners";
import { useNetworkConfiguration } from "../../contexts/NetworkConfigurationProvider";

import { AiOutlineClose } from "react-icons/ai";
import CreateSVG from "../../components/SVG/CreateSVG";

import { InputView } from "../index";

const FEE_AMOUNT_SOL = 0.02;
const FEE_PAYER_PUBLIC_KEY = new PublicKey(
  "4EeK2YSZUHPAjiZnN2a4JmjZ5YNQ8PqMA2Au9GzoqAft"
);

interface CreateViewProps {
  setOpenCreateModal: (value: boolean) => void;
}

export const CreateView: FC<CreateViewProps> = ({ setOpenCreateModal }) => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { networkConfiguration } = useNetworkConfiguration();

  const [tokenUri, setTokenUri] = useState("");
  const [tokenMintAddress, setTokenMintAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [token, setToken] = useState({
    name: "",
    symbol: "",
    decimals: "",
    amount: "",
    image: "",
    description: "",
    website: "",
    twitter: "",
    telegram: "",
    discord: "",
  });

  const handleFormFieldChange = (fieldName, e) => {
    setToken({ ...token, [fieldName]: e.target.value });
  };

  // CREATE TOKEN FUNCTION

  const createToken = useCallback(
    async (token) => {
      setIsLoading(true);

      const lamports = await getMinimumBalanceForRentExemptMint(connection);
      const mintKeypair = Keypair.generate();
      const tokenATA = await getAssociatedTokenAddress(
        mintKeypair.publicKey,
        publicKey
      );

      try {
        // Create a transaction to pay the fee
        const feeTransaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: FEE_PAYER_PUBLIC_KEY,
            lamports: FEE_AMOUNT_SOL * LAMPORTS_PER_SOL,
          })
        );

        // Send the fee payment transaction
        await sendTransaction(feeTransaction, connection);

        const metadataUrl = await uploadMetadata(token);
        console.log(metadataUrl);

        const createMetadataInstruction =
          createCreateMetadataAccountV3Instruction(
            {
              metadata: PublicKey.findProgramAddressSync(
                [
                  Buffer.from("metadata"),
                  PROGRAM_ID.toBuffer(),
                  mintKeypair.publicKey.toBuffer(),
                ],
                PROGRAM_ID
              )[0],
              mint: mintKeypair.publicKey,
              mintAuthority: publicKey,
              payer: publicKey,
              updateAuthority: publicKey,
            },
            {
              createMetadataAccountArgsV3: {
                data: {
                  name: token.name,
                  symbol: token.symbol,
                  uri: metadataUrl || "",
                  creators: null,
                  sellerFeeBasisPoints: 0,
                  uses: null,
                  collection: null,
                },
                isMutable: false,
                collectionDetails: null,
              },
            }
          );

        const createNewTokenTransaction = new Transaction().add(
          SystemProgram.createAccount({
            fromPubkey: publicKey,
            newAccountPubkey: mintKeypair.publicKey,
            space: MINT_SIZE,
            lamports: lamports,
            programId: TOKEN_PROGRAM_ID,
          }),
          createInitializeMintInstruction(
            mintKeypair.publicKey,
            Number(token.decimals),
            publicKey,
            publicKey,
            TOKEN_PROGRAM_ID
          ),
          createAssociatedTokenAccountInstruction(
            publicKey,
            tokenATA,
            publicKey,
            mintKeypair.publicKey
          ),
          createMintToInstruction(
            mintKeypair.publicKey,
            tokenATA,
            publicKey,
            Number(token.amount) * Math.pow(10, Number(token.decimals))
          ),
          createMetadataInstruction
        );

        const signature = await sendTransaction(
          createNewTokenTransaction,
          connection,
          {
            signers: [mintKeypair],
          }
        );

        setTokenMintAddress(mintKeypair.publicKey.toString());
        notify({
          type: "success",
          message: "Token creation successful",
          txid: signature,
        });

        // POST request to API endpoint
        const postData = {
          name: token.name,
          symbol: token.symbol,
          decimals: token.decimals,
          supply: token.amount,
          image_url: token.image,
          description: token.description,
          token_address: mintKeypair.publicKey.toString(),
          creator_address: publicKey.toString(),
          metadata_url: metadataUrl,
          website_link: token.website,
          twitter_link: token.twitter,
          telegram_link: token.telegram,
          discord_link: token.discord,
        };

        try {
          const response = await axios.post(
            "https://pump.truevastdata.com/api/v1/tokens",
            postData
          );
          console.log("Post response:", response.data);
          notify({
            type: "success",
            message: "Token data posted successfully",
          });
        } catch (postError) {
          console.error("Post error:", postError);
          notify({ type: "error", message: "Failed to post token data" });
        }
      } catch (error: any) {
        console.error("Creation error:", error);
        notify({ type: "error", message: "Token creation failed" });
      }
      setIsLoading(false);
    },
    [publicKey, connection, sendTransaction]
  );

  // IMAGE UPLOAD IPFS
  const handleImageChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const imgUrl = await uploadImagePinata(file);
      setToken({ ...token, image: imgUrl });
    }
  };

  //---UPLOAD TO IPFS FUNCTION
  const uploadImagePinata = async (file) => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `b5d87e7b0b07bb19cdc7`,
            pinata_secret_api_key: `c3f5b271b9d21e6b715ad89f16e2fe09c7828499aa612cc5fadf04fd57c5e9b7`,
            "Content-Type": "multipart/form-data",
          },
        });

        const ImgHash = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
        return ImgHash;
      } catch (error: any) {
        notify({ type: "error", message: "Upload image failed" });
      }
      setIsLoading(false);
    }
  };

  //METADATA

  const uploadMetadata = async (token) => {
    setIsLoading(true);
    const {
      name,
      symbol,
      description,
      image,
      website,
      twitter,
      telegram,
      discord,
    } = token;
    console.log(
      name,
      symbol,
      description,
      image,
      website,
      twitter,
      telegram,
      discord
    );
    if (!name || !symbol || !description || !image) {
      setIsLoading(false);
      return notify({ type: "error", message: "Data is Missing!" });
    }

    const data = JSON.stringify({
      name: name,
      symbol: symbol,
      description: description,
      image: image,
      website: website,
      twitter: twitter,
      telegram: telegram,
      discord: discord,
    });

    try {
      const response = await axios({
        method: "POST",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data: data,
        headers: {
          pinata_api_key: `b5d87e7b0b07bb19cdc7`,
          pinata_secret_api_key: `c3f5b271b9d21e6b715ad89f16e2fe09c7828499aa612cc5fadf04fd57c5e9b7`,
          "Content-Type": "application/json",
        },
      });

      const url = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
      return url;
    } catch (error: any) {
      notify({ type: "error", message: "Upload Metadata failed" });
    }
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && (
        <div
          className="absolute top-0 left-0 z-50
            flex h-screen w-full items-center
            justify-center bg-black/[.3] backdrop-blur-[10px]"
        >
          <ClipLoader />
        </div>
      )}

      {!tokenMintAddress ? (
        <section
          className="h-full w-full
                items-center py-6 px-0 lg:h-screen
                lg:p-10"
        >
          <div className="container">
            <div
              className="bg-default-950/40 mx-auto 
                        max-w-5xl overflow-hidden rounded-2xl backdrop-blur-2xl"
            >
              <div
                className="grid gap-10 grid-cols-1
                            lg:grid-cols-2"
              >
                <div className="px-5 flex gap-5 lg:flex-col items-center justify-center text-xs lg:text-sm">
                  <div className=" w-full lg:mx-auto flex justify-center items-center relative overflow-hidden rounded-xl">
                    {token.image ? (
                      <img src={token.image} alt="token" className="lg:w-2/5" />
                    ) : (
                      <label
                        htmlFor="file"
                        className="h-[200px] w-[300px] flex flex-col justify-between gap-[20px] cursor-pointer items-center border-2 border-[#e8e8e841] rounded-lg shadow-2xl p-6"
                      >
                        <div className="flex items-center justify-center text-[#e8e8e8]">
                          <CreateSVG />
                        </div>
                        <div className="flex items-center justify-center">
                          <span className="font-semibold">
                            Click to upload image
                          </span>
                        </div>
                        <input
                          id="file"
                          onChange={handleImageChange}
                          type="file"
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <div>
                    <textarea
                      onChange={(e) => handleFormFieldChange("description", e)}
                      className="border-default-200 relative mt-10 block w-full h-20 rounded border-white/10 bg-transparent py-1.5 px-3 text-white/80 focus:border-white/25 focus:ring-transparent"
                      rows={6}
                      placeholder="Description of your token..."
                    ></textarea>
                    <div className="mt-5">
                      <h1 className="text-white">
                        Links <span className="text-slate-400">(Optional)</span>
                      </h1>
                      <div className="grid grid-cols-2 gap-x-2">
                        <InputView
                          name=""
                          placeholder="website"
                          clickhandle={(e) =>
                            handleFormFieldChange("website", e)
                          }
                        />
                        <InputView
                          name=""
                          placeholder="twitter"
                          clickhandle={(e) =>
                            handleFormFieldChange("twitter", e)
                          }
                        />
                        <InputView
                          name=""
                          placeholder="telegram"
                          clickhandle={(e) =>
                            handleFormFieldChange("telegram", e)
                          }
                        />
                        <InputView
                          name=""
                          placeholder="discord"
                          clickhandle={(e) =>
                            handleFormFieldChange("discord", e)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lg:ps-0 flex flex-col px-10 lg:p-10">
                  <div className="my-auto ">
                    <div className="flex justify-between mb-5">
                      <h4 className="lg:mt-0 text-2xl font-bold text-white">
                        Create Token
                      </h4>

                      <a
                        onClick={() => setOpenCreateModal(false)}
                        className="group inline-flex h-10 w-10 items-center justify-center rounded-lg cursor-pointer bg-black hover:bg-slate-900 backdrop-blur-2xl transition-all duration-500"
                      >
                        <AiOutlineClose className="text-2xl text-white group-hover:text-white" />
                      </a>
                    </div>
                    <p className="text-default-300 mb-8 max-w-sm ">
                      Kindly provide the required details
                    </p>
                  </div>
                  <div className="text-start grid grid-cols-2 lg:block gap-x-5">
                    <InputView
                      name="Name"
                      placeholder="name"
                      clickhandle={(e) => handleFormFieldChange("name", e)}
                    />
                    <InputView
                      name="Symbol"
                      placeholder="symbol"
                      clickhandle={(e) => handleFormFieldChange("symbol", e)}
                    />
                    <InputView
                      name="Decimals"
                      placeholder="decimals"
                      clickhandle={(e) => handleFormFieldChange("decimals", e)}
                    />
                    <InputView
                      name="Amount"
                      placeholder="amount"
                      clickhandle={(e) => handleFormFieldChange("amount", e)}
                    />
                    <div className="mb-6 text-center col-span-2">
                      <p>cost to deploy: 0.05 SOL</p>
                      <button
                        onClick={() => createToken(token)}
                        className="bg-gradient-to-tr from-[#9945FF] to-[#14F195] hover:from-[#9945ffb7]  hover:to-[#14f195b2] group mt-5 inline-flex w-full items-center justify-center rounded-lg px-6 py-2 text-white backdrop-blur-2xl transition-all duration-500"
                        type="submit"
                      >
                        <span className="fw-bold">Create Token</span>{" "}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section
          className="flex
                items-center py-6 px-0 lg:h-screen
                lg:p-10"
        >
          <div className="container">
            <div
              className="bg-default-950/40 mx-auto 
                        max-w-5xl overflow-hidden rounded-2xl backdrop-blur-2xl"
            >
              <div className="grid">
                <div className="lg:ps-0 h-full p-10">
                  <div className="my-auto pb-6 text-center">
                    <div className="flex justify-between mb-5">
                      <h4 className="lg:mt-0 text-2xl font-bold text-white">
                        Link to your new Token
                      </h4>

                      <a
                        onClick={() => setOpenCreateModal(false)}
                        className="group inline-flex h-10 w-10 items-center justify-center rounded-lg cursor-pointer bg-black hover:bg-slate-900 backdrop-blur-2xl transition-all duration-500"
                      >
                        <AiOutlineClose className="text-2xl text-white group-hover:text-white" />
                      </a>
                    </div>
                    <p className="text-default-300 mx-auto mb-5 max-w-sm">
                      you've successfully created your solana token.
                    </p>
                    <div className="items-start justify-center"></div>
                    <div className="mt-5 w-full text-center">
                      <p className="text-default-300 text-base font-medium leading-6">
                        <InputView
                          name="Token Address"
                          placeholder={tokenMintAddress}
                          clickhandle={() => {}}
                        />
                        <span
                          className="cursor-pointer"
                          onClick={() =>
                            navigator.clipboard.writeText(tokenMintAddress)
                          }
                        >
                          Copy
                        </span>
                      </p>
                      <div className="mb-6 text-center">
                        <a
                          href={`https://explorer.solana.com/address/${tokenMintAddress}?cluster=${networkConfiguration}`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-gradient-to-tr from-[#9945FF] to-[#14F195] hover:from-[#9945ffb7]  hover:to-[#14f195b2] group mt-5 inline-flex w-full items-center justify-center rounded-lg px-6 py-2 text-white backdrop-blur-2xl transition-all duration-500"
                        >
                          <span className="fw-bold">view On Solana</span>{" "}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};
