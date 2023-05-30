import useSWR from "swr";
import { getAccount } from "@tokenbound/sdk";
import { getViemClient, SUPPORTED_CHAINS } from "../../core/utils";
import { Address, isAddress } from 'viem';

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

  const client = getViemClient(chain);

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


