import { fromJSProcessor, JSProcessor } from "ethereum-indexer-js-processor";
import {createProcessor, contractsData } from '../event-processor-nfts';
import {createIndexerInitializer} from '../utils/indexer';
import type {EIP1193Provider} from 'eip-1193';

import {
  createIndexerState,
  keepStateOnLocalStorage,
  keepStreamOnIndexedDB,
  type LogParseConfig,
} from "ethereum-indexer-browser";
import { connect } from "../utils/web3";
import react from "react";
import { useEffect } from "react";

import type { NextPage } from "next";
import { Button } from "../components/button";

import { useAccount, useConnect, useNetwork } from "wagmi";
import { Address } from "../core/types";

const Itemizer: NextPage = () => {

  const { address } = useAccount();
  const { connect, connectors } = useConnect();
  const { chain, chains } = useNetwork();

	const initialProcessor = createProcessor();

  const {state, status, syncing, initialize, updateProcessor, updateIndexer } = createIndexerInitializer(
		'mynfts',
		initialProcessor,
		contractsData,
		undefined // work on all chainId
	);

  const findNFTs = () => {
    const ethereum = (window as any).ethereum;
    if (ethereum) {

      let connection = {
        ethereum: ethereum as EIP1193Provider,
        chainId: (chain.id).toString(),
        accounts: [
          address
        ]
      }

      const accountAs32Bytes = `0x000000000000000000000000${connection.accounts[0].slice(2)}` as const;

      initialize(connection, {
        parseConfig: {
          filters: {
            Transfer: [[accountAs32Bytes], [null, accountAs32Bytes]],
          },
        },
        // getAddress to ensure we get a checksum address that the processor use for string comparison
        processorConfig: {account: address},
      })

    }
  }

  let runningProcessor = initialProcessor;
	let firstTime = true;

  const update = () => {
		if (firstTime) {
			// skip first as we do not care and the processor is not ready by then
			// TODO throw if processor not ready ?
			firstTime = false;
			return;
		}
		try {
			const newProcessor = createProcessor();
			(newProcessor as any).copyFrom && (newProcessor as any).copyFrom(runningProcessor);
			updateProcessor(newProcessor);
			runningProcessor = newProcessor;
		} catch (err) {
			console.error(err);
		}

    console.log(state);
  }

  useEffect(() => {
  }, []);
 
  return (
    <>
    <Button onClick={findNFTs}>
      <h1>Itemizer</h1>
    </Button>

    <Button onClick={update}>
      <h1>Update</h1>
    </Button>
  </>
  )
} 

export default Itemizer;