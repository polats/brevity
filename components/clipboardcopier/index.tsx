import { CheckIcon, Square2StackIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

type CliboardCopierProps = {
    label: string;
    clipboardText: string;
  };



  export const ClipboardCopier = ({ label, clipboardText }: CliboardCopierProps) => {

    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(clipboardText);

        setIsCopied(true);

        setTimeout(() => {
          setIsCopied(false);
        }, 2000);    
    
    }


    return (
        <>
        <p className="font-bold">
            {label}
        </p>
      <button
            className="inline p-0.5 mx-0.5 rounded-sm text-black dark:text-white focus:bg-black focus:text-white dark:focus:bg-white dark:focus:text-black focus:outline-none"
            onClick={handleCopy}
          >
            {
              isCopied ?
              <CheckIcon className="h-6 w-6" />
              : <Square2StackIcon className="h-6 w-6" />
            }
          </button>     
        </>
    );
}






// export const ClipboardCopier = ({ label, clipboardText  }: CliboardCopierProps)  =>  {

     


//     return
//     (
//         <>
//         <button
//         className="inline p-0.5 mx-0.5 rounded-sm text-black dark:text-white focus:bg-black focus:text-white dark:focus:bg-white dark:focus:text-black focus:outline-none"
//         onClick={handleCopy}
//         >
//         <span className="sr-only">{label}</span>
//         <Square2StackIcon className="h-4 w-4" />
//         </button>        
//         </>
//     );
// }
