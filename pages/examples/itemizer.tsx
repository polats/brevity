import { useQueryStates, queryTypes } from "next-usequerystate";
import { Field } from "../../components/field";
import { ORAGallery } from "../../components/oragallery";
import { ClipboardCopier } from "../../components/clipboardcopier";
import { useNFTDetails } from "../../hooks/useNFTDetails";
import { useRouterReady } from "../../hooks/useRouterReady";
import { TokenboundInspector } from "../../components/tokenboundinspector";
import { useState } from "react";

function App() {

  const routerReady = useRouterReady();

  const ORA_LOCATION = "/assets/arcadians.ora"
  const TOKENBOUND_SALT = 0;

  const EXAMPLE_TOKEN_ADDRESSES = [
    {
        name: "Arcadians (mainnet)",
        address: "0xc3c8a1e1ce5386258176400541922c414e1b35fd"
    },
    {
        name: "Arcadians (goerli)",
        address: "0x03f1dba6f15f145a1fbb5e29940d2e7d13f4d4f8"
    }
  ]

  const [tokenInfo, setTokenInfo] = useQueryStates(
    {
      chain: queryTypes.string.withDefault(""),
      address: queryTypes.string.withDefault(""),
      tokenid: queryTypes.string.withDefault("")
    }
  );

  const handleTokenInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newState = {
      ...tokenInfo,
      [e.target.name]: e.target.value
    }
    setTokenInfo(newState)
  }

  const { data, isLoading, isError, error } = useNFTDetails(tokenInfo);  
  const [ tokenboundAddress, setTokenboundAddress ] = useState("");

    return (
    <div className="App">

        <h3 className="font-bold text-2xl">ERC-6551 Itemizer</h3>
        <p>
        This example app creates individual ERC-1155s from a given ERC-721's attributes, 
        following the Tokenbound ER-6551 standard.
        <br/><br/>
        The ORA file in <b>{ORA_LOCATION}</b>  contains images of all the attributes.</p>
        Expand the json viewer below and click on a src filename to preview each image.
        <br/><br/>
        
        <ORAGallery path={ORA_LOCATION} />
        <br/>
        <br/>
        Next we put it the deployed contract details and the token id of the ERC-721 we want to itemize.
        Here are some example addresses you can copy to clipboard:
        {
          EXAMPLE_TOKEN_ADDRESSES.map((example) => (
              <div className="flex space-x-2">
                <ClipboardCopier 
                  label={example.name} 
                  clipboardText={example.address}/>  
                </div> 
          ))
        }    
        
      {
        routerReady &&
          <div className="flex space-x-2 mt-2">
                <Field
                    disabled={false}
                    inputName={"mainnet, goerli, ..."}
                    value={tokenInfo.chain || ''}
                    name="chain"
                    type="chain"
                    id="chain"
                    handleChange={handleTokenInfoChange}
                />
                <Field
                    disabled={false}
                    inputName={"number"}
                    value={tokenInfo.address || ''}
                    name="address"
                    type="address"
                    id="address"
                    handleChange={handleTokenInfoChange}
                />            
                <Field
                    disabled={false}
                    inputName={"number"}
                    value={tokenInfo.tokenid || ''} 
                    name="tokenid"
                    type="tokenid"
                    id="tokenid"
                    handleChange={handleTokenInfoChange}
                />            
          </div>
      }
        
        {tokenboundAddress}

        <TokenboundInspector 
          salt={TOKENBOUND_SALT}
          tokenInfo={tokenInfo}
          setTokenboundAddress={setTokenboundAddress}
        />

        <div className="flex flex-col">
          { isLoading && <p>Loading...</p> }
          { isError && <p>Error: {error.toString()}</p> }
          { data && <p>{JSON.stringify(data)}</p> }
        </div> 

    </div>
  );

}

export default App;