import { Result } from "../../core/types";
import { ABI_FETCH_ERRORS } from "../../hooks/useEtherscanAbi";
import { Square2StackIcon } from "@heroicons/react/24/outline";

type OutputProps = {
  data: Result;
  isTouched: boolean;
  isLoading: boolean;
  isError: boolean;
  error: any | null;
};

const EXAMPLE_CONTRACT = "0xc3c8a1e1ce5386258176400541922c414e1b35fd";

const handleCopyAddress = () => {
  navigator.clipboard.writeText(EXAMPLE_CONTRACT);
};      

const formatMessage = (data: any) => {
  let message = data.brevityerror;

  switch (message) {

    case ABI_FETCH_ERRORS.INVALID_CHAINID:
      return (
        <>{message}</>
      )
    break;

    case ABI_FETCH_ERRORS.INVALID_ADDRESS:

      return (
        <>
          {message} such as: {EXAMPLE_CONTRACT}
          <button
            className="inline p-0.5 mx-0.5 rounded-sm text-black dark:text-white focus:bg-black focus:text-white dark:focus:bg-white dark:focus:text-black focus:outline-none"
            onClick={handleCopyAddress}
          >
            <span className="sr-only">Copy Address</span>
            <Square2StackIcon className="h-4 w-4" />
          </button>        
        </>
      )
      break;
  }
}

const formatData = (data: any) => {

  if (data === undefined || data === null) return "";
    
  if (data.error) return data.error; 

  if (data.brevityerror) {
    return formatMessage(data);
  }

  if (data.result) {
    return (
      <p>
      {data.result}
      </p>
    )
  }

//   if (typeof data === "string") return data;
//   if (Array.isArray(data)) return `(${data.map(formatData).join(", ")})`;
//   return data.toString();
};

export const AbiOutput = ({
  data,
  isTouched,
  isLoading,
  isError,
  error,
}: OutputProps) => {
  if (isLoading) return <span>loading...</span>;
  if (isError && isTouched)
    return (
      <span>{error && error.reason ? `Error: ${error.reason}` : "Error"}</span>
    );
  return formatData(data);
};
