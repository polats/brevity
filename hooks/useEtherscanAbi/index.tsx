import useSWR from "swr";
import { isAddress } from "viem";
import {
    Address
  } from "../../core/types";

const API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;


export const ABI_FETCH_ERRORS = {
    INVALID_CHAINID: "invalid chainid. Can use any of the following: 1, mainnet, 11155111, sepolia, 5, or goerli",
    INVALID_ADDRESS: "invalid address. Please make sure it's a valid ethereum address",
}

const fetchContracts = async(contractDetails) : Promise<any> => {

    let chainPrefix = null;

    // check if chainid is valid for etherscan
    switch (contractDetails.chainid) {
        case "1":
        case "mainnet":
            chainPrefix= "";
            break;
        case "11155111":
        case "sepolia":
           chainPrefix = "-sepolia";
           break;
        case "5":
        case "goerli":
            chainPrefix = "-goerli";
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

    return data;

    //     const response = await fetch("/api/contracts");
    //     const data = await response.json();


    //   return data;
};

export type ContractDetailsProps = {
    chainid: number,
    address: Address
}

export const useEtherscanAbi = (contractDetails: ContractDetailsProps) => {
  const { data, error, mutate, isLoading } = useSWR(
    contractDetails,
    fetchContracts
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


// import { ContractDetails } from "core/types";
// import useSWR from "swr";

// const fetchContracts = async (): Promise<ContractDetails[]> => {
//   const response = await fetch("/api/contracts");
//   const data = await response.json();
//   return data;
// };

// export const useContracts = () => {
//   const { data, error, mutate, isLoading } = useSWR(
//     "/api/contracts",
//     fetchContracts
//   );

//   return {
//     isLoading,
//     mutate,
//     contracts: data || [],
//     isError: !!error,
//   };
// };
