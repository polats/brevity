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
import { AbiOutput } from "../abioutput";
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

    const { data, isLoading, isError, error } = useEtherscanAbi
    ({
        chainid: formattedArgs[0] as number,
        address: formattedArgs[1] as Address,
    });

  const { state: collapsed, toggle: toggleCollapsed } =
    useToggle(initialCollapsed);

  return (
      !collapsed && (
        <>
          <Inputs name={func.name} args={args} updateValue={updateValue} />
          <Container>
            { /* <Button onClick={() => refetch()}>read</Button> */ }
            <AbiOutput
              data={data}
              isTouched={isTouched}
              isLoading={isLoading}
              isError={isError}
              error={error}
            />
          </Container>
        </>
      )
  );
};
