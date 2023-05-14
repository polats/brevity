import { ethers } from 'ethers';
import fs from 'fs';
import _ from 'lodash';
import shell from 'shelljs';
import { invariant } from 'ts-invariant';

import { networkDefinitions } from '../constants';
import { TNetworkNamesList } from '../models';
// import scaffoldConfig from '~common/scaffold.config';
// import { getMnemonic, getMnemonicPath } from '~helpers/functions';

require('dotenv').config();

interface IForgeScriptsRequiredArgs {
  network: TNetworkNamesList;
  sender?: string;
}

const CONTRACT_INFO_FILE_PATH = "contractInfo.json";

const CONTRACT_NAME = 'Counter';
const CONTRACT_SCRIPT = 'Counter.s.sol'
const DEPLOY_FUNCTION = 'CounterScript';

const getAddressFromStdout = (stdout: string): string => {
    var address = stdout.split("Contract Address: ")[1].split("\n")[0];

    return address;
}

const saveContractInfoJson = async (network: string, name: string, address: string, abi: string): Promise<void> => {

    let previousJson = {};

    try {   
        previousJson = JSON.parse(await fs.readFileSync(CONTRACT_INFO_FILE_PATH, 'utf8'));
    } catch (err) {
        console.log("missing contractInfo.json file, creating new one");
    }

    const contractInfo = {
        [network]: {
            [name]: {
                address: address,
                abi: JSON.parse(abi)
            }
        }
    }
   
    let newJson = _.merge(previousJson, contractInfo);

    fs.writeFile(CONTRACT_INFO_FILE_PATH, JSON.stringify(newJson, null, 2), (err) => {
        if (err) {
            console.log(err);
        }
    });

    console.log("Contract info saved to " + CONTRACT_INFO_FILE_PATH);
}

export const deploy = async (): Promise<void> => {
  const network = process.env.TARGET_NETWORK as TNetworkNamesList ?? 'localhost';

  const createCmd = await createFoundryDeployArgs({ network });

  console.log(createCmd);

  const address = getAddressFromStdout(shell.exec(createCmd, { silent: true, async: false }));

  console.log(CONTRACT_NAME + " | " + network + " | " + address);

  const getAbiCmd = "forge inspect " + CONTRACT_NAME + " abi"; 
  const abi = shell.exec(getAbiCmd, { silent: true, async: false }).stdout;

  console.log(abi);

  saveContractInfoJson(network, CONTRACT_NAME, address, abi);  
};

export const createFoundryDeployArgs = async (
  { network, sender }: IForgeScriptsRequiredArgs,
  forgeScriptsOptionalArgs: Record<string, string> = {}
): Promise<string> => {
  // const mnemonicPaths = await getMnemonicPath(sender);
  // const mnemonic = getMnemonic(mnemonicPaths);
  const mnemonic = process.env.MNEMONIC as string;
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

void deploy();
