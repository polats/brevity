import { useTokenboundAddress } from "../../hooks/useTokenboundAddress"
import { TokenInfo, TokenboundParams } from "../../core/types"
import { useEffect } from "react";

export const TokenboundInspector = ( {salt, tokenInfo, setTokenboundAddress }) => {

    const tokenboundAddress = useTokenboundAddress({salt, tokenInfo});

    // const { data, isLoading, isError, error } = useTokenUri(uri);    

    // useEffect(() => {
    //     setTokenboundAddress(tokenboundAddress);
    // }, [tokenboundAddress])

    return (
        <div className="overflow-auto max-h-96">
            {
                tokenboundAddress?.data ?
                "Tokenbound address: " + tokenboundAddress?.data?.tokenboundAddress :
                    "No data found"
            }
            <br/>
            {
                tokenboundAddress?.data?.contractBytecode ?
                "deployed" : "not deployed"
            }

        {
            
            // data ? 
            // renderJSON(data) :
            //     "No data found"
        }
        </div>
  )
}


