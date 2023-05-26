import contractInfo from '../../../../contractInfo';
import type { NextApiRequest, NextApiResponse } from "next";
import { Address } from 'viem';

import { createPublicClient, http } from 'viem'
import { 
  mainnet,
  localhost,
  goerli,
  sepolia,
  polygon,
  polygonMumbai,
  optimism,
  arbitrum  
  } from 'viem/chains'

const SUPPORTED_CHAINS = [
  'mainnet', 
  'localhost',
  'goerli',
  'sepolia',
  'polygon', 
  'polygonMumbai',
  'optimism',
  'arbitrum']

const retrieveChain = (chain: string) => {
  switch (chain) {
    case 'mainnet':
      return mainnet;
    case 'localhost':
      return localhost;
    case 'goerli':
      return goerli;
    case 'sepolia':
      return sepolia;
    case 'polygon':
      return polygon;
    case 'polygonMumbai':
      return polygonMumbai;
    case 'optimism':
      return optimism;
    case 'arbitrum':
      return arbitrum;
  }
}
  
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const { address, chain, func, ...args } = req.query;
    const wagmiAbi =  contractInfo.mumbai[0].abi // retrieved from the test MyNFT contract

  console.log(args)

    if (!address) {
        return res.status(400).json({
            error: 'Missing address',
        });
    }

    if (!chain || !SUPPORTED_CHAINS.includes(chain.toString())) {
      return res.status(400).json({
          error: 'Missing or unsupported chain (supported: ' + SUPPORTED_CHAINS.toString() + ' )',
      });
  }

  if (!func) {
    return res.status(400).json({
        error: 'Missing func. (some examples: tokenURI, balanceOf, ownerOf, totalSupply)',
    });
  }

    let selectedChain = retrieveChain(chain.toString());

    const client = createPublicClient({
      chain: selectedChain,
      transport: http(),
    })
    

    const data = await client.readContract({
        address: address as Address,
        abi: wagmiAbi,
        functionName: func.toString(),
        args: Object.values(args),
      })
  
    return res.status(200).json({
        result: data.toString()
    });


}
