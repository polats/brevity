import { Inputs } from "../inputs";
import {
  AbiDefinedViewFunction,
  AbiParameterWithComponents,
  Address,
} from "../../core/types";
import { useArgs } from "../../hooks";
import { useEtherscanAbi } from "../../hooks/useEtherscanAbi";
import { Container } from "../function/container";
import { AbiOutput } from "../abioutput";

type ViewProps = {
  func: AbiDefinedViewFunction;
};

export const AbiViewer = ({ func }: ViewProps) => {
  const { args, formattedArgs, updateValue, isTouched } = useArgs(
    func.inputs as AbiParameterWithComponents[]
  );

    const { data, isLoading, isError, error } = useEtherscanAbi
    ({
        name: formattedArgs[0] as string,
        chainid: formattedArgs[1] as number,
        address: formattedArgs[2] as Address
    });

  return (

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

  );
};
