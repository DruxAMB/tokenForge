import { FC, useEffect, useCallback, useState } from "react";
import useUserSOLBalanceStore from "../../stores/useUserSOLBalanceStore";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { notify } from "../../utils/notifications";
import { AiOutlineClose } from "react-icons/ai";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionSignature,
} from "@solana/web3.js";

//INTERNAL IMPORT
import { InputView } from "../index";


interface DonateViewProps {

  setOpenSendTransaction: (value: boolean) => void;

}

export const DonateView: FC<DonateViewProps> = ({ setOpenSendTransaction }) => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [amount, setAmount] = useState("0.0");

  const balance = useUserSOLBalanceStore((s) => s.balance);
  const { getUserSOLBalance } = useUserSOLBalanceStore();

  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58());
      getUserSOLBalance(wallet.publicKey, connection);
    }
  }, [wallet.publicKey, connection, getUserSOLBalance]);

  const solInputValidation = async (e) => {
    const monstrosity = /((^\.(\d+)?$)|(^\d+(\.\d*)?$)|(^$))/;
    const res = new RegExp(monstrosity).exec(e.target.value);
    res && setAmount(e.target.value);
  };

  const onClick = useCallback(async () => {
    if (!publicKey) {
      notify({ type: "error", message: `Wallet not connected!` });
      console.log("error", `Send Transaction: Wallet not connected!`);
      return;
    }

    const creatorAddress = new PublicKey(
      "9DivFequxGbkSbGbcXCUen54KmxRSDecYv8f9CHzaHt5"
    );
    let signature: TransactionSignature = "";

    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: creatorAddress,
          lamports: LAMPORTS_PER_SOL * Number(amount),
        })
      );

      signature = await sendTransaction(transaction, connection);

      notify({
        type: "success",
        message: "Transaction successful!",
        txid: signature,
      });
    } catch (error: any) {
      notify({
        type: "error",
        message: `Transaction failed!`,
        description: error?.message,
        txid: signature,
      });
      console.log("error", `Transaction failed! ${error?.message}`, signature);
      return;
    }
  }, [publicKey, amount, sendTransaction, connection]);

  //COMPONENT
  const CloseModal = () => (
    <a
      onClick={() => setOpenSendTransaction(false)}
      className="group inline-flex h-10 w-10 items-center justify-center rounded-lg cursor-pointer bg-black hover:bg-slate-900 backdrop-blur-2xl transition-all duration-500"
    >
      <i className="mdi mdi-facebook text-2xl text-white group-hover:text-white">
        <AiOutlineClose />
      </i>
    </a>
  );

  return (
    <>
    <section className="flex items-center py-6 px-0 lg:h-screen lg:p-10">
      <div className="container">
        <div className="bg-default-950/40 mx-auto max-w-5xl overflow-hidden rounded-2xl backdrop-blur-2xl">
          
            <div className="lg:ps-0 flex h-full flex-col p-10">
              
              <div className="my-auto pb-6 text-center">
              <div className="flex gap-10 justify-between mb-5">
                <h4 className="mb-4 text-2xl font-bold text-white">
                  {wallet && (
                    <p>SOL Balance: {(balance || 0).toLocaleString()}</p>
                  )}
                </h4>
                      <CloseModal />
                    </div>
                <p className="text-default-300 mx-auto mb-5 max-w-sm">
                  Support this project.
                </p>
                <div className="text-start">
                  <InputView
                    name="Amount"
                    placeholder=" amount"
                    clickhandle={() => {}}
                  />
                </div>
                <div className="mt-5 w-full text-center">
                  <div className="mb-6 text-center">
                    <button
                      onClick={onClick}
                      disabled={!publicKey}
                      className="bg-gradient-to-tr from-[#9945FF] to-[#14F195] hover:from-[#9945ffb7]  hover:to-[#14f195b2] cursor-pointer group mt-5 inline-flex w-full items-center justify-center rounded-lg px-6 py-2 text-white backdrop-blur-2xl transition-all duration-500"
                    >
                      <span className="fw-bold">Donate</span>{" "}
                    </button>
                    
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </section></>
  );
};
