import { ContractsInChain, ContractDetails } from "../../core/types";
import useSWR from "swr";
import contractData from "../../contractInfo"
import { Contract } from "../../components/contract";

const fetchContracts = async (): Promise<ContractsInChain[]> => {
  const response = await fetch("/api/contracts");
  const data = await response.json();

  return data;
};

export const useContracts = () => {
  // const { data, error, mutate, isLoading } = useSWR(
  //   "/api/contracts",
  //   fetchContracts
  // );

  // const response = await fetch("/api/contracts");
  // const data = await response.json();

  // return {
  //   isLoading,
  //   mutate,
  //   contracts: data || [],
  //   isError: !!error,
  // };

  let contractsInChain : ContractsInChain[] = [];
  for (const chain in contractData) {

    let chainObject : ContractsInChain;
    let contractArray : ContractDetails[] = [];

    for (const contract in contractData[chain]) {
      contractArray.push(contractData[chain][contract] as ContractDetails);
    }
    chainObject = {
      chainName: chain,
      contracts: contractArray
    }
    
    contractsInChain.push(chainObject);

  }

  return {
    contractsInChain: contractsInChain
  }


};
