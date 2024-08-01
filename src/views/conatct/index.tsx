import { FC, useCallback, useState } from "react";
import { useForm, ValidationError } from "@formspree/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction, PublicKey } from "@solana/web3.js";
import { AiOutlineClose } from "react-icons/ai";
import { notify } from "../../utils/notifications";
import {
  DataV2,
  createUpdateMetadataAccountV2Instruction,
  PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";
import { InputView } from "../index";

//

interface ContactViewProps {
  setOpenContact: (value: boolean) => void;
}

export const ContactView: FC<ContactViewProps> = ({ setOpenContact }) => {
  //FORM
  const [state, handleSubmit] = useForm("xayrdgob");
  if (state.succeeded) {
    return (
      <h1 className="md:text-5xl/tight my-4 max-w-lg text-4xl font-medium text-white">
        Thanks for sending your message!
      </h1>
    );
  }

  //COMPONENT
  const CloseModal = () => (
    <a
      onClick={() => setOpenContact(false)}
      className="group inline-flex h-10 w-10 items-center justify-center rounded-lg cursor-pointer bg-black hover:bg-slate-900 backdrop-blur-2xl transition-all duration-500"
    >
      <i className="mdi mdi-facebook text-2xl text-white group-hover:text-white">
        <AiOutlineClose />
      </i>
    </a>
  );
  return (
    <>
      <section className="flex items-center py-6 lg:h-screen lg:p-10">
        <div className="container">
          <div className="bg-default-950/40 mx-auto overflow-hidden rounded-2xl backdrop-blur-2xl">
            <div className="lg:ps-0 flex h-full w-96 md:w-[450px] max-w-xl flex-col p-10">
              <div className="my-auto pb-6 text-center">
                <div className="flex justify-between mb-5">
                  <h4 className="lg:mt-0 text-lg md:text-2xl font-bold text-white">
                    Get in touch
                  </h4>
                  <CloseModal />
                </div>
                <p className="text-default-300 mx-auto mb-5 max-w-sm"></p>
                <div className="text-start">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label
                        htmlFor="email"
                        className="text-base/normal text-default-200 mb-2 block font-semibold"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="border-default-200 block w-full rounded border-white/10 bg-transparent py-1.5 px-3 text-white/80 focus:border-white/25 focus:ring-transparent"
                        placeholder={"email"}
                      />
                    </div>
                    <ValidationError
                      prefix="Email"
                      field="email"
                      errors={state.errors}
                    />
                    <textarea
                      id="message"
                      name="message"
                      className="border-default-200 relative  block w-full rounded border-white/10 bg-transparent py-1.5 px-3 text-white/80 focus:border-white/25 focus:ring-transparent"
                      rows={6}
                      placeholder="message.."
                    ></textarea>
                    <ValidationError
                      prefix="Message"
                      field="message"
                      errors={state.errors}
                    />

                    <div className="mb-6 text-center">
                      <button
                        type="submit"
                        disabled={state.submitting}
                        className="bg-gradient-to-tr from-[#9945FF] to-[#14F195] hover:from-[#9945ffb7]  hover:to-[#14f195b2] group mt-5 inline-flex w-full items-center justify-center rounded-lg px-6 py-2 text-white backdrop-blur-2xl transition-all duration-500"
                      >
                        <span className="fw-bold">Send Message</span>{" "}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
