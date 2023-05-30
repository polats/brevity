import useSWR from "swr";
import { getAccount } from "@tokenbound/sdk";
import { Address, isAddress } from 'viem';
import { createPublicClient, http } from 'viem'
import { 
  mainnet,
  localhost,
  goerli,
  sepolia,
  polygon,
  polygonMumbai,
  optimism,
  arbitrum  
  } from 'viem/chains'

// export const useTokenboundDeployer = (tokenInfo) => {

//   const fetchTokenMetadata = async(tokenInfo) : Promise<any> => {

//     let url = "/api/read-contract/nft?" + 
//               "address=" + tokenInfo.address + 
//               "&chain=" + tokenInfo.chain + 
//               "&func=" + "tokenURI" +
//               "&tokenid=" + tokenInfo.tokenid;

//     const response = await fetch(url);
//     const data = await response.json();

//     if (data?.result) {
//       const tokenMetadata = await fetch(data.result);
//       const tokenMetadataJson = await tokenMetadata.json();
//       return tokenMetadataJson;
//     }

//     return data;
//   };  

//   const { data, error, mutate, isLoading } = useSWR(
//     tokenInfo,
//     fetchTokenMetadata
//   );

//   return {
//     data,
//     error,
//     isLoading,
//     mutate,
//     isError: !!error,
//   };

    
// };

const fetchContracts = async(contractDetails) : Promise<any> => {

  let chainPrefix = null;
  let chainName = null;

 // check if name is not blank
 if (contractDetails.name === null || contractDetails.name === "") {
  return {
      brevityerror: ABI_FETCH_ERRORS.NAME_NOT_FOUND
  }
  }

  // check if chainid is valid for etherscan
  switch (contractDetails.chainid) {
      case "1":
      case "mainnet":
          chainPrefix= "";
          chainName = "mainnet";
          break;
      case "11155111":
      case "sepolia":
         chainPrefix = "-sepolia";
         chainName = "sepolia";
         break;
      case "5":
      case "goerli":
          chainPrefix = "-goerli";
          chainName = "goerli";
          break;
  }   

  if (chainPrefix == null) {
      return {
          brevityerror: ABI_FETCH_ERRORS.INVALID_CHAINID
      }
  }

  // check if address is valid

  if (!isAddress(contractDetails.address)) {
      return {
          brevityerror: ABI_FETCH_ERRORS.INVALID_ADDRESS
      }
  }

  let URL = 'https://api' + chainPrefix + ".etherscan.io/api?module=contract" + 
  "&action=getabi&address=" + contractDetails.address + "&apikey="
  + API_KEY;

  const response = await fetch(URL);
  const data = await response.json();

  data.chain = chainName;
  data.address = contractDetails.address;
  data.name = contractDetails.name;

  return data;

  //     const response = await fetch("/api/contracts");
  //     const data = await response.json();


  //   return data;
};



const SUPPORTED_CHAINS = [
  'mainnet', 
  'localhost',
  'goerli',
  'sepolia',
  'polygon', 
  'polygonMumbai',
  'optimism',
  'arbitrum']

const retrieveChain = (chain: string) => {
  switch (chain) {
    case 'mainnet':
      return mainnet;
    case 'localhost':
      return localhost;
    case 'goerli':
      return goerli;
    case 'sepolia':
      return sepolia;
    case 'polygon':
      return polygon;
    case 'polygonMumbai':
      return polygonMumbai;
    case 'optimism':
      return optimism;
    case 'arbitrum':
      return arbitrum;
  }
}
  
const TOKENBOUND_ERRORS = {
  INVALID_CHAINID: "invalid chainid. Can use any of the following: 1, mainnet, 11155111, sepolia, 5, or goerli",
  INVALID_ADDRESS: "invalid address. Please make sure it's a valid ethereum address",
  INVALID_TOKENID: "invalid tokenid. Please make sure it's a valid number",
}

const isNumeric = (num: any) => (typeof(num) === 'number' || typeof(num) === "string" && num.trim() !== '') && !isNaN(num as number);

const fetchTokenboundAddress = async({salt, tokenInfo}) : Promise<any> => {
  const chain = tokenInfo.chain;
  const address = tokenInfo.address;
  const tokenid = tokenInfo.tokenid;

  // check if chain is valid
  if (!chain || !SUPPORTED_CHAINS.includes(chain.toString())) {
    return {
      brevityerror: TOKENBOUND_ERRORS.INVALID_CHAINID      
    }
  }

  // check address valid
  if (!isAddress(address)) {
    return {
        brevityerror: TOKENBOUND_ERRORS.INVALID_ADDRESS
    }
  }

  // check tokenid valid
  if (!isNumeric(tokenid)) {
    return {
        brevityerror: TOKENBOUND_ERRORS.INVALID_TOKENID
    }
  }

  // create client
  let selectedChain = retrieveChain(chain.toString());

  const client = createPublicClient({
    chain: selectedChain,
    transport: http(),
  })

  const tokenboundAddress = await getAccount(
    address,
    tokenid,
    client);
  

  const contractBytecode = await client.getBytecode({
    address: tokenboundAddress
  });

  return {
    tokenboundAddress,
    contractBytecode
  };
};

export const useTokenboundAddress = ({salt, tokenInfo}) => {
  const { data, error, mutate, isLoading } = useSWR(
    {salt, tokenInfo},
    fetchTokenboundAddress
  );

  return {
    data,    
    error,
    isLoading,
    mutate,
    contracts: data || [],
    isError: !!error,
  };

  


};


