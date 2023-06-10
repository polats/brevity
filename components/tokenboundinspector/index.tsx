import { useTokenboundAddress } from "../../hooks/useTokenboundAddress"
import { createAccount } from "@tokenbound/sdk";
import { createWalletClient, custom } from "viem";
import { useAccount } from "wagmi";
import { create } from "lodash";
import { retrieveChain } from "../../core/utils";
import { useEffect } from "react";

export const TokenboundInspector = ( {salt, tokenInfo, setTokenboundAddress }) => {

    const optionClasses = "self-start border border-black dark:border-white px-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-200 focus:bg-slate-200 dark:hover:bg-white dark:hover:text-black dark:focus:bg-white dark:focus:text-black focus:outline-none"

    const { data } = useTokenboundAddress({salt, tokenInfo});
    const { address, isConnecting, isDisconnected } = useAccount();

    const createTokenboundAccount = async () => {

        const client = createWalletClient({
            account: address,
            chain: retrieveChain(tokenInfo.chain),
            transport: custom(window.ethereum)
        })

        const hash = await createAccount(
            tokenInfo.address,
            tokenInfo.tokenid,
            client
        )
    }

    useEffect(() => {
        if (data?.tokenboundAddress) {
            setTokenboundAddress(data?.tokenboundAddress)
        }
    }, [data])

    return (
        <div className="overflow-auto max-h-96">
            {
            data &&
                <div>
                    <b>Tokenbound Address: </b>
                    {
                        data?.tokenboundAddress ?
                        data?.tokenboundAddress :
                            "invalid token info"
                    }
                    <br/>
                    {
                        
                        data?.contractBytecode ?
                        "Wallet already deployed" : 
                        data?.tokenboundAddress &&
                        (
                            <div>
                                <button className={`bg-base-100 text-base-content cursor-pointer font-sans gap-2 py-2 px-2 ${optionClasses}`} onClick={createTokenboundAccount}>
                                    Deploy (make sure you're connected to the right chain and have enough ETH)
                                </button>
                            </div>
                        )
                    }
                </div>
            }
        </div>
  )
}


