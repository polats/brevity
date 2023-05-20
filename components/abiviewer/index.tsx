import { Button } from "../button";
import { Inputs } from "../inputs";
import {
  Abi,
  AbiDefinedViewFunction,
  AbiParameterWithComponents,
  Address,
  Result,
} from "../../core/types";
import { useArgs, useToggle } from "../../hooks";
import { useContractRead } from "wagmi";
import { useEtherscanAbi, type ContractDetailsProps } from "../../hooks/useEtherscanAbi";
import { Container } from "../function/container";
import { Output } from "../function/output";
import { Anchor } from "../anchor";
import { use, useEffect } from "react";

type ViewProps = {
  address: Address;
  func: AbiDefinedViewFunction;
  initialCollapsed: boolean;
};

export const AbiViewer = ({ address, func, initialCollapsed }: ViewProps) => {
  const { args, formattedArgs, updateValue, isTouched } = useArgs(
    func.inputs as AbiParameterWithComponents[]
  );
//   const { data, isLoading, isError, error, refetch } = useContractRead<
//     Abi,
//     string,
//     Result
//   >({
//     abi: [func],
//     address,
//     args: formattedArgs,
//     functionName: func.name,
//     watch: true,
//   });

// type ContractDetails = {
//     chainid: number,
//     address: Address
// }

    const { data, isLoading, isError, error, refetch } = useEtherscanAbi
    ({
        chainid: formattedArgs[0] as number,
        address: formattedArgs[1] as Address,
    });

  useEffect(() => {
    console.log(error);
  }, [formattedArgs]);

  const { state: collapsed, toggle: toggleCollapsed } =
    useToggle(initialCollapsed);

  return (
    <li key={func.name} className="flex flex-col gap-2">

    <h3 className="font-bold text-2xl">Adding A Deployed Contract</h3>
    <p className="">
          To add an already deployed contract to the <b>Contracts</b> sidebar, we first need to retrieve its ABI. An ABI viewer is provided below, which retrieves the ABI from {" "}
          <Anchor href="https://etherscan.io">
            Etherscan
          </Anchor>
          . <br></br>
    </p>    

    <h2 className="font-bold">ABI Viewer</h2>
    Please input the contract details:
      {!collapsed && (
        <>
          <Inputs name={func.name} args={args} updateValue={updateValue} />
          <Container>
            { /* <Button onClick={() => refetch()}>read</Button> */ }
            <p>{error}</p>
            <Output
              data={data}
              isTouched={isTouched}
              isLoading={isLoading}
              isError={isError}
              error={error}
            />
          </Container>
        </>
      )}
    </li>
  );
};
