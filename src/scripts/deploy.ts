import { ethers } from 'ethers';
import fs from 'fs';
import _ from 'lodash';
import shell from 'shelljs';
import { invariant } from 'ts-invariant';
import { hideBin } from 'yargs/helpers';

import { networkDefinitions } from '../constants';
import { TNetworkNamesList } from '../models';
// import scaffoldConfig from '~common/scaffold.config';
// import { getMnemonic, getMnemonicPath } from '~helpers/functions';

require('dotenv').config();

interface IForgeScriptsRequiredArgs {
  network: TNetworkNamesList;
  sender?: string;
}

const CONTRACT_INFO_FILE_PATH_JSON = "contractInfo.json";
const CONTRACT_INFO_FILE_PATH_TS = "contractInfo.ts";

// const CONTRACT_NAME = 'Counter';
// const CONTRACT_SCRIPT = 'Counter.s.sol'
// const DEPLOY_FUNCTION = 'CounterScript';

// const CONTRACT_NAME = 'YourNFT';
// const CONTRACT_SCRIPT = 'YourNFT.deploy.s.sol'
// const DEPLOY_FUNCTION = 'YourNFTDeploy';

const CONTRACT_NAME = 'InventoryFacet';
const CONTRACT_SCRIPT = 'InventoryFacet.s.sol'
const DEPLOY_FUNCTION = 'Deploy';


const getAddressFromStdout = (stdout: string): string => {
    var address = stdout.split("Contract Address: ")[1].split("\n")[0];

    return address;
}

const saveContractInfo = async (network: string, name: string, address: string, abi: string): Promise<void> => {

    let previousJson = {};
   
    try {   
        previousJson = JSON.parse(await fs.readFileSync(CONTRACT_INFO_FILE_PATH_JSON, 'utf8'));
    } catch (err) {
        console.log("missing contractInfo.json file, creating new one");
    }

    // const chainId = networkDefinitions[network].chainId;
 
    const contractInfo = {
        [network]: [
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
   
    let newJson = JSON.stringify(_.mergeWith(previousJson, contractInfo, customizer), null, 2);


    fs.writeFile(CONTRACT_INFO_FILE_PATH_JSON, newJson, (err) => {
        if (err) {
            console.log(err);
        }
    });

    let jsonToTs = "export default " + newJson + ";";

    fs.writeFile(CONTRACT_INFO_FILE_PATH_TS, jsonToTs, (err) => {
      if (err) {
          console.log(err);
      }
  });

}

export const deploy = async (network): Promise<void> => {
  const createCmd = await createFoundryDeployArgs({ network });

  console.log(createCmd);

  const deployResult = shell.exec(createCmd, { silent: true, async: false });

  if (deployResult.code !== 0) {
    console.error(deployResult.stderr);
    return;
  }

  const address = getAddressFromStdout(deployResult);

  console.log(CONTRACT_NAME + " | " + network + " | " + address);

  const getAbiCmd = "forge inspect " + CONTRACT_NAME + " abi"; 
  const abi = shell.exec(getAbiCmd, { silent: true, async: false }).stdout;

  console.log(abi);

  saveContractInfo(network, CONTRACT_NAME, address, abi);  
};

export const createFoundryDeployArgs = async (
  { network, sender }: IForgeScriptsRequiredArgs,
  forgeScriptsOptionalArgs: Record<string, string> = {}
): Promise<string> => {
  // const mnemonicPaths = await getMnemonicPath(sender);
  // const mnemonic = getMnemonic(mnemonicPaths);
  let mnemonic = process.env.LOCAL_MNEMONIC as string;

  switch (network) {
    case 'sepolia':
    case 'goerli':
      mnemonic = process.env.TESTNET_MNEMONIC as string;
      break;
  }

  const wallet = ethers.Wallet.fromMnemonic(mnemonic);
  invariant(wallet.address, 'Could not find find mnemonic and address, create MNEMONIC variable in .env');

  const rpcUrl: string = networkDefinitions[network].rpcUrl;
  invariant(rpcUrl != null, `Could not find rpcUrl in 'networkDefinitions' for '${network}'`);

  const options = Object.keys(forgeScriptsOptionalArgs)
    .map((key) => `--${key} ${forgeScriptsOptionalArgs[key]}`)
    .join(' ');

  const target = CONTRACT_SCRIPT + ':' + DEPLOY_FUNCTION;
  const cmd = `forge script script/` + target + ` --broadcast --rpc-url ${rpcUrl} --json --sender ${wallet.address} --mnemonics "${mnemonic}" ${options}`;
  return cmd;
};

let network = hideBin(process.argv)[0] ?? "localhost";

void deploy(network);
