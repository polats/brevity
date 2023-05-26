import { Anchor } from "../../components/anchor";
import { useQueryStates, queryTypes } from "next-usequerystate";
import { useRouterReady } from "../../hooks/useRouterReady";
import { Field } from "../../components/field";

function App() {

  const routerReady = useRouterReady();

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

    return (
    <div className="App">
        <h3 className="font-bold text-2xl">Token Info</h3>
        Please input the token details:
        <br/>
      {
        routerReady &&
          <div className="flex space-x-2 mt-2">
                <Field
                    disabled={false}
                    inputName={"mainnet, sepolia, goerli, ..."}
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
  </div>
  );

}

export default App;