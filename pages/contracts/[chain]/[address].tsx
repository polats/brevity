import { Contract } from "../../../components/contract";
import { Address } from "../../../core/types";
import type { NextPage } from "next";
import { useRouter } from "next/router";

const ContractPage: NextPage = () => {
  const router = useRouter();
  const { chain, address } = router.query;

  return (
    <>
      <h2 className="font-bold">Contract</h2>
      <Contract chain={chain as string} address={address as Address} />
    </>
  );
};

export default ContractPage;
