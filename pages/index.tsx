import Link from "next/link";
import type { NextPage } from "next";

const Home: NextPage = () => (
  <>
    <h2 className="font-bold">Welcome to Brevity!</h2>
    <p>Brevity is a foundry + nextjs framework designed to easily prototype and deploy Ethereum dapps.</p>
    <p>It includes a contract sidebar, with some example contracts shown that a user can interact with.</p>
    <br/>
    <p>To interact with the contracts, login using the wallet button on the upper-right.</p>
    <p>Once you're logged in, you can click on the contract in the sidebar to interact with it.</p> 
    <br/>
    <p>Also make sure that you're logged in to the network that the contracts are deployed in.</p>
    <p>You can switch networks by clicking the button beside the address.</p>
    <br/>
    <h2 className="font-bold">Example Dapps</h2>
    <p>Some example dapps can be accessed from the dropdown above.</p>
    <p>Try adding other deployed contracts on the sidebar using the &#160;
    <Link
              href={`/examples/contract`}
              className={`underline focus:underline focus:outline-none hover:bg-slate-200 focus:bg-slate-200 dark:hover:bg-white dark:hover:text-black dark:focus:bg-white dark:focus:text-black`}
    >
              📜 Contracts Example
    </Link>    
   </p>
  </>
);

export default Home;
