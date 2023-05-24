import useSWR from "swr";

// const API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;

// // export const ABI_FETCH_ERRORS = {
//     NAME_NOT_FOUND: "invalid name. Please make sure it's not blank",
//     INVALID_CHAINID: "invalid chainid. Can use any of the following: 1, mainnet, 11155111, sepolia, 5, or goerli",
//     INVALID_ADDRESS: "invalid address. Please make sure it's a valid ethereum address",
// }

const fetchTokenMetadata = async(uri) : Promise<any> => {

    const response = await fetch(uri);
    const data = await response.json();
    return data;
};

export const useTokenUri = (uri) => {
  const { data, error, mutate, isLoading } = useSWR(
    uri,
    fetchTokenMetadata
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


