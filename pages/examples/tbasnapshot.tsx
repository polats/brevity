import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { getAccount } from "@tokenbound/sdk";
import { getViemClient } from "../../core/utils";

const ReactJson = dynamic(
  () => import('react-json-view'),
  { ssr: false}
)

function App() {

  const [accountJson, setAccountJson] = useState(
    {
      "address": "0x718a9D173E66C411f48E41d3dA2fa6f0CE8f5D3c",
      "tokenid": "1"
    }
  );

  const [tokenboundAddress, setTokenboundAddress]= useState(
    "0x26727Ed4f5BA61d3772d1575Bca011Ae3aEF5d36"
  );

  // const contractBytecode = await client.getBytecode({
  //   address: tokenboundAddress
  // });

  // const tokenboundAddress = await getAccount(
  //   address,
  //   tokenid,
  //   client);

  const updateAccounts = async (e) => {
      const address = e.updated_src.address;
      const tokenid = e.updated_src.tokenid;
      const client = getViemClient("goerli");
      const tokenboundAddress = await getAccount(
        address, tokenid, client);
      
      setTokenboundAddress(tokenboundAddress);
  }

  useEffect(() => {

    }, []);

    return (
    <div className="App">
        Edit the NFT address and token id below to get their TBA equivalent 👉<br/><br/>         
        <div className="grid grid-cols-2 gap-4">
          <div className="overflow-y-auto h-72">
              <ReactJson src={accountJson} theme="hopscotch" onEdit={updateAccounts} enableClipboard={true}/>
          </div>
          <div className="overflow-y-auto h-72">
            <b>Tokenbound Address:</b><br/>
            {tokenboundAddress}
          </div>
        </div>
    </div>
  );

}

export default App;