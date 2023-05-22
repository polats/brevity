import { useEffect } from "react";
import { AbiViewer } from "../../components/abiviewer";
import { Anchor } from "../../components/anchor";
import { AbiDefinedViewFunction } from "../../core/types";

function App() {

    const func = {
      inputs: [
        {
          internalType: "string",
          name: "Give your contract a name",
          type: "name"
        },        {
          internalType: "number",
          name: "1 || mainnet || 11155111 || sepolia || 5 || goerli || ....",
          type: "chainid"
        },
        {
          internalType: "address",
          name: "0xD34DB33F...",
          type: "address"
        },


      ],
      name: "External Contract Address",
      outputs: [
        {
          internalType: "string",
          name: "abi json",
          type: "string"
        }
      ],
      stateMutability: "view",
      type: "function",
    }

    useEffect(() => {

    }, []);

    return (
    <div className="App">
      <li key={func.name} className="flex flex-col gap-2">
        <h3 className="font-bold text-2xl">Adding A Deployed Contract</h3>
        <p className="">
          To add an already deployed contract to the <b>Contracts</b> sidebar, we need to retrieve its ABI and copy it to <b>/contractInfo.ts. </b>
          An ABI viewer is provided below which retrieves the ABI from {" "}
          <Anchor href="https://etherscan.io">
            Etherscan
          </Anchor>
        . <br></br>
        </p>    
        Please input the contract details:
        <AbiViewer
              func={func as AbiDefinedViewFunction}
            />
        </li>
      </div>
    );

}

export default App;