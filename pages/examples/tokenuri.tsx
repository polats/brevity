import { useEffect, useState } from "react";
import Link from "next/link";
import { Field } from "../../components/field";
import { TokenUriViewer } from "../../components/tokenuriviewer";

function App() {


    useEffect(() => {

    }, []);

    const [uri, setUri] = useState<string>("api/tokenuri");
    const [tokenId, setTokenId] = useState<string>("1");

    const handleChangeTokenID =(e: React.ChangeEvent<HTMLInputElement>) => {
        setTokenId(e.target.value);
    }
    const handleChangeURI = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUri(e.target.value);
    }


    return (
    <div className="App">
      <h2 className="font-bold">What is a TokenURI Server?</h2>
      <p>
        A TokenURI server is a server that provides metadata for NFTs.
        The tokenURI is set on the contract, and is
        used by dapps to retrieve the metadata of a token.
        <br></br>        
        <br></br>
        Brevity provides an example TokenURI server using Next.js API routes.
        See the following source files for more information:
        <br></br>
        <br></br>
        </p>
        <li>
            <Link
                href={`https://github.com/polats/brevity/blob/main/pages/api/tokenuri/%5Btokenid%5D.ts`}
                className={`underline focus:underline focus:outline-none hover:bg-slate-200 focus:bg-slate-200 dark:hover:bg-white dark:hover:text-black dark:focus:bg-white dark:focus:text-black`}
        >
                pages/api/tokenuri/[id].ts
            </Link>           
            : the API route that returns the metadata
        </li>
        <li>
            <Link
                href={`https://github.com/polats/brevity/blob/main/src/constants/tokenuri.ts`}
                className={`underline focus:underline focus:outline-none hover:bg-slate-200 focus:bg-slate-200 dark:hover:bg-white dark:hover:text-black dark:focus:bg-white dark:focus:text-black`}
        >
                src/constants/tokenuri.ts
            </Link>           
            : contains the JSON metadata            
        </li>        
        <br></br>        

        The api itself can be accessed via the following url (replace 1 with the token id as needed) :

            <Link
            href={`../api/tokenuri/1`}
            className={`underline focus:underline focus:outline-none hover:bg-slate-200 focus:bg-slate-200 dark:hover:bg-white dark:hover:text-black dark:focus:bg-white dark:focus:text-black`}
            >
                /api/tokenuri/1
            </Link>

        <br></br>        
        <br></br>        

        <h2 className="font-bold">TokenURI Gallery Component</h2>
        <p>
            Brevity also provides a TokenURI Viewer component to visualize the NFT metadata.
        </p>
        <br></br>  
        <div className="flex space-x-2">
            <div className="flex flex-col space-y-2">
                <Field
                    disabled={false}
                    inputName={"string"}
                    value={uri}
                    name="TokenURI"
                    type="URI"
                    id="tokenuri"
                    handleChange={handleChangeURI}
                />
                <Field
                    disabled={false}
                    inputName={"number"}
                    value={tokenId}
                    name="TokenURI"
                    type="TokenID"
                    id="tokenid"
                    handleChange={handleChangeTokenID}
                />
            </div>
            <div className="flex flex-col space-y-2">
                <TokenUriViewer>
                    {uri + "/" + tokenId}
                </TokenUriViewer>
            </div>
        </div>
    </div>
  );

}

export default App;