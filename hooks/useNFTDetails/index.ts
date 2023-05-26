import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { result } from "lodash";

export const useNFTDetails = (tokenInfo) => {

  const fetchTokenMetadata = async(tokenInfo) : Promise<any> => {

    let url = "/api/read-contract/nft?" + 
              "address=" + tokenInfo.address + 
              "&chain=" + tokenInfo.chain + 
              "&func=" + "tokenURI" +
              "&tokenid=" + tokenInfo.tokenid;

    const response = await fetch(url);
    const data = await response.json();

    if (data?.result) {
      const tokenMetadata = await fetch(data.result);
      const tokenMetadataJson = await tokenMetadata.json();
      return tokenMetadataJson;
    }

    return data;
  };  

  const { data, error, mutate, isLoading } = useSWR(
    tokenInfo,
    fetchTokenMetadata
  );

  return {
    data,
    error,
    isLoading,
    mutate,
    isError: !!error,
  };

    
};

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


