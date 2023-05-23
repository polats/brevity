import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { CheckIcon, Square2StackIcon } from "@heroicons/react/24/outline";
import { useToggle } from "../../hooks";
import { Anchor } from "../anchor";
import contractData from "../../contractInfo"
import _ from "lodash";
import { useState } from "react";

export const AbiClipboard = ({ abi, chain, address, name }) => {

  const contractChain = chain;
  const { state: collapsed, toggle: toggleCollapsed } =
  useToggle(true);

  const [isCopied, setIsCopied] = useState(false);
 
const newContractInfoJson = () => {
  const contractInfo = {
    [contractChain]: 
      [
        {
            name: name,
            abi: JSON.parse(abi),
            address: address
        }
      ]
    }

    function customizer(objValue, srcValue) {
      if (_.isArray(objValue)) {
        return objValue.concat(srcValue);
      }
    }    
    

  let newJson = "export default " + JSON.stringify(_.mergeWith(contractData, contractInfo, customizer), null, 2) + ";";
  return newJson
}

  const handleCopyAddress = () => {
    
    navigator.clipboard.writeText(newContractInfoJson());

    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);    
  };      

  const [CollapseIcon, collapseText] = collapsed
    ? [PlusIcon, "Expand"]
    : [MinusIcon, "Collapse"];

  return (
    <>
    <div className="flex items-center gap-2">
      <h4 className="">
        <b>ABI Found.</b>
      </h4>
      {/*
      View here  &#8594;
      <button
        className="inline p-0.5 mx-0.5 rounded-sm text-black dark:text-white focus:bg-black focus:text-white dark:focus:bg-white dark:focus:text-black focus:outline-none"
        onClick={toggleCollapsed}
      >
        <span className="sr-only">{collapseText}</span>
        <CollapseIcon className="h-6 w-6" />
      </button>
      */}
      </div>

      <div className="flex items-center gap-2">

      <h4 className="">
        To add the contract, replace your local&#160;
        <Anchor href="https://github.com/polats/brevity/blob/main/contractInfo.ts">
            contractInfo.ts 
          </Anchor>
          &#160;with the new ABIs. Copy to clipboard here &#8594;
      </h4>
      <button
            className="inline p-0.5 mx-0.5 rounded-sm text-black dark:text-white focus:bg-black focus:text-white dark:focus:bg-white dark:focus:text-black focus:outline-none"
            onClick={handleCopyAddress}
          >
            <span className="sr-only">Copy Address</span>
            {
              isCopied ?
              <CheckIcon className="h-8 w-8" />
              : <Square2StackIcon className="h-8 w-8" />
            }
          </button>      
      </div>
      
      <h4 className="">
        Copying to clipboard will also temporarily add the contract to the sidebar. Try selecting some contracts to have the sidebar update.
        This will not be saved unless you replace your local contractInfo.ts file.
      </h4>
      {!collapsed && (
        <div className="font-mono text-sm p-4 text-black dark:text-black bg-slate-100 dark:bg-slate-100 rounded border border-slate-200 dark:border-slate-200">
          {abi}
        </div>
      )}
    </>

  );
};
