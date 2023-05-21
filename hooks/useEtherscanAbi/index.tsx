import useSWR from "swr";
import { isAddress } from "viem";
import {
    Address
  } from "../../core/types";

const API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;

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
            status: 1,
            error: "invalid chainid",
            message: "invalid chainid"
        }
    }

    // check if address is valid

    if (!isAddress(contractDetails.address)) {
        return {
            status: 1,
            error: "invalid address",
            message: "invalid address"
        }
    }


    let URL = 'https://api' + chainPrefix + ".etherscan.io/api?module=contract" + 
    "&action=getabi&address=" + contractDetails.address + "&apikey="
    + API_KEY;

    const EXAMPLE_CONTRACT = "0xc3c8a1e1ce5386258176400541922c414e1b35fd";

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
