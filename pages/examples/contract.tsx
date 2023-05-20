import { useEffect } from "react";
import { AbiViewer } from "../../components/abiviewer";

function App() {

    const func = {
      inputs: [
        {
          internalType: "number",
          name: "1 || mainnet || 11155111 || sepolia || 5 || goerli",
          type: "chainid"
        },
        {
          internalType: "address",
          name: "0xD34DB33F...",
          type: "address"
        }
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
          <AbiViewer
              address={"0x0"}
              func={func}
              initialCollapsed={false}
            />
    </div>
  );

}

export default App;