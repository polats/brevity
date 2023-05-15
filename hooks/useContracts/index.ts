import { ContractDetails } from "../../core/types";
import useSWR from "swr";
import contractData from "../../contractInfo"

const LOCALHOST_CHAIN_ID = "31337";

const fetchContracts = async (): Promise<ContractDetails[]> => {
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

  let contractDetails : ContractDetails[] = [];

  contractDetails.push(contractData[LOCALHOST_CHAIN_ID][0] as ContractDetails);

  return {
    contracts: contractDetails
  }


};
