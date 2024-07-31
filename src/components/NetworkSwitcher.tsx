import { FC, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useNetworkConfiguration } from "../contexts/NetworkConfigurationProvider";

//INTERNAL IMPORT
import NetworkSwitcherSVG from "./SVG/NetworkSwitcherSVG";

const NetworkSwitcher: FC = () => {
  const { networkConfiguration, setNetworkConfiguration } = useNetworkConfiguration();
  const [isSelectVisible, setIsSelectVisible] = useState(false);

  const handleSVGClick = () => {
    // Toggle the visibility of the select element
    setIsSelectVisible(!isSelectVisible);
  };

  const handleNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("Selected Network:", e.target.value);
    setNetworkConfiguration(e.target.value || "devnet");
  };

  useEffect(() => {
    console.log("Current Network Configuration in Component:", networkConfiguration);
  }, [networkConfiguration]);

  return (
    <>
      <input type="checkbox" id="checkbox" />
      <label className="switch">
        <select
          value={networkConfiguration}
          onChange={handleNetworkChange}
          className={`select w-16 max-w-xs border-none bg-transparent outline-0 ${
            isSelectVisible ? "block" : "hidden"
          }`}
        >
          <option className="bg-blue-400 w-full text-center" value="mainnet-beta">
            mainnet
          </option>
          <option className="bg-blue-400 w-full text-center" value="devnet">
            devnet
          </option>
          <option className="bg-blue-400 w-full text-center" value="testnet">
            testnet
          </option>
        </select>
        <button onClick={handleSVGClick}>
          <NetworkSwitcherSVG />
        </button>
      </label>
    </>
  );
};

export default dynamic(() => Promise.resolve(NetworkSwitcher), {
  ssr: false,
});
