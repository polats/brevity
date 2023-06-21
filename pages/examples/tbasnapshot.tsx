import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { getAccount } from "@tokenbound/sdk";
import { getViemClient } from "../../core/utils";

const ReactJson = dynamic(
  () => import('react-json-view'),
  { ssr: false}
)

const EditableInput = ({ initialValue, onEdit }) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    onEdit(newValue);
  };

  return (
    <input
      type="text"
      size={50}
      value={value}
      onChange={handleChange}
    />
  );
};

function App() {

  const optionClasses = "self-start border border-black dark:border-white px-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-200 focus:bg-slate-200 dark:hover:bg-white dark:hover:text-black dark:focus:bg-white dark:focus:text-black focus:outline-none"

  const [accountJson, setAccountJson] = useState(
    {
      "address": "0x718a9D173E66C411f48E41d3dA2fa6f0CE8f5D3c",
      "tokenid": "1"
    }
  );

  const [collectionAddress, setCollectionAddress]= useState(
    "0x718a9D173E66C411f48E41d3dA2fa6f0CE8f5D3c");

  const [tokenboundAddress, setTokenboundAddress]= useState(
    "0xC659Ec3bD5fAA69d0AE000726122C420f44d9cd8"
  );

  const [tokenboundAddressCollection, setTokenboundAddressCollection]= useState(
    [
      ["1", "0x26727Ed4f5BA61d3772d1575Bca011Ae3aEF5d36"]
    ]);

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10; // Number of entries per page


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

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleEdit = (newValue) => {
    setCollectionAddress(newValue);
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, accountJson, collectionAddress]);

  const fetchData = async () => {
    try {
      const startId = (currentPage - 1) * pageSize;
      const idsToFetch = Array.from({ length: pageSize }, (_, index) => (startId + index + 1).toString());
      const address = collectionAddress;

      const client = getViemClient("goerli");

      const responses = await Promise.all(
        idsToFetch.map(
          tokenid => getAccount(address, tokenid, client)
          )
      );

      const formattedData = []

      for (let i = 0; i < idsToFetch.length; i++) {
        formattedData.push([idsToFetch[i], responses[i]]);
      }

      setTokenboundAddressCollection(formattedData);

    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };


  

    return (
    <div className="App">
        Edit the NFT address and token id below to get their TBA equivalent 👉<br/><br/>         
        <div className="grid grid-cols-2 gap-4">
          <div className="overflow-y-auto h-36">
              <ReactJson src={accountJson} theme="hopscotch" onEdit={updateAccounts} enableClipboard={true}/>
          </div>
          <div className="overflow-y-auto h-36">
            <b>Tokenbound Address:</b><br/>
            {tokenboundAddress}
          </div>
        </div>

        <br/>  
        Or browse through all token ids a page at a time 👇<br/><br/>
        address: 
          <EditableInput initialValue="0x718a9D173E66C411f48E41d3dA2fa6f0CE8f5D3c" onEdit={handleEdit} />
        <br/><br/>        

        <button disabled={currentPage < 1} key={"Previous"} className={`outline-base-content overflow-hiddentext-left`} 
          onClick={previousPage}>
          <div className={`bg-base-100 text-base-content w-full cursor-pointer font-sans ${optionClasses}`}>
              <div className="grid grid-cols-5 grid-rows-3">
              <div className="col-span-5 row-span-3 row-start-1 flex gap-2 py-2 px-2 items-center">
                  <div className="text-left flex-grow text-sm font-bold">
                  Previous
                  </div>
              </div>
              </div>
          </div>
        </button>


        <button key={"Next"} className={`outline-base-content overflow-hiddentext-left`} 
          onClick={nextPage}>
          <div className={`bg-base-100 text-base-content w-full cursor-pointer font-sans ${optionClasses}`}>
              <div className="grid grid-cols-5 grid-rows-3">
              <div className="col-span-5 row-span-3 row-start-1 flex gap-2 py-2 px-2 items-center">
                  <div className="text-left flex-grow text-sm font-bold">
                  Next
                  </div>
              </div>
              </div>
          </div>
        </button>

        <div>
          <div className="grid grid-cols-2 gap-4">
            <div>Token ID</div>
            <div>Tokenbound Address</div>
          </div>
            {tokenboundAddressCollection.map((entry) => (
          <div className="grid grid-cols-2 gap-4">
              <div key={entry[0]}>
                {entry[0]}
              </div>
              <div key={entry[0] + entry[1]}>
              {entry[1]}
              </div>
          </div>
        ))}          
        </div>

    </div>
  );

}

export default App;