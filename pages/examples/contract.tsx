import { useEffect } from "react";
import { AbiViewer } from "../../components/abiviewer";

function App() {

    const func = {
      inputs: [
        {
          internalType: "address",
          name: "contract address",
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