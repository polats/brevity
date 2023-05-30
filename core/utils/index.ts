import { getAddress as _getAddress } from "viem";
import { Address } from "../types";
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
import { createPublicClient, http } from 'viem'

export const SUPPORTED_CHAINS = [
  'mainnet', 
  'localhost',
  'goerli',
  'sepolia',
  'polygon', 
  'polygonMumbai',
  'optimism',
  'arbitrum']
  
const getAddress = (address: Address) => {
  try {
    return _getAddress(address);
  } catch {
    return null;
  }
};

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
  

const getViemClient = (chain: string) => {
 // create client
 let selectedChain = retrieveChain(chain.toString());

 const client = createPublicClient({
   chain: selectedChain,
   transport: http(),
 })
 return client
}


export { getAddress, getViemClient, retrieveChain };
