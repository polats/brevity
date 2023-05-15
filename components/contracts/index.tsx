import { ContractsInChain, ContractDetails } from "../../core/types";
import { useContracts } from "../../hooks";
import Link from "next/link";
import { useRouter } from "next/router";

export const Contracts = () => {
  const router = useRouter();
  const { address } = router.query;
  const { contractsInChain } = useContracts();

  // if (isLoading) return <div className="flex-grow">loading...</div>;
  // if (isError) return <div className="flex-grow">error</div>;

  if (contractsInChain.length === 0)
    return <div className="flex-grow">No contracts</div>;
  return (
    <ul className="flex-grow">
      {
        contractsInChain.map((chain: ContractsInChain ) => (
          chain.contracts.map((contract: ContractDetails) => (
            <li key={chain.chainName + " | " + contract.address}>
            <Link
              href={`/contracts/${chain.chainName}/${contract.address}`}
              className={`focus:underline focus:outline-none hover:bg-slate-200 focus:bg-slate-200 dark:hover:bg-white dark:hover:text-black dark:focus:bg-white dark:focus:text-black ${
                contract.address === address ? "font-semibold" : ""
              }`}
            >
              {chain.chainName + " | " + contract.name}
            </Link>
          </li>
          ))
        ))
      }
    </ul>
  );
};
