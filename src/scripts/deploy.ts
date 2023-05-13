import { ethers } from 'ethers';
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

export const deploy = async (): Promise<void> => {
  const network = process.env.TARGET_NETWORK as TNetworkNamesList ?? 'localhost';

  const cmd = await createFoundryDeployArgs({ network });
  console.log(cmd);
  shell.exec(cmd, { silent: false, async: true });
};

export const createFoundryDeployArgs = async (
  { network, sender }: IForgeScriptsRequiredArgs,
  forgeScriptsOptionalArgs: Record<string, string> = {}
): Promise<string> => {
  // const mnemonicPaths = await getMnemonicPath(sender);
  // const mnemonic = getMnemonic(mnemonicPaths);
  const mnemonic = process.env.MNEMONIC as string;
  const wallet = ethers.Wallet.fromMnemonic(mnemonic);
  invariant(wallet.address, 'Could not find find mnemonic and address, run yarn generate and yarn account');

  const rpcUrl: string = networkDefinitions[network].rpcUrl;
  invariant(rpcUrl != null, `Could not find rpcUrl in 'networkDefinitions' for '${network}'`);

  const options = Object.keys(forgeScriptsOptionalArgs)
    .map((key) => `--${key} ${forgeScriptsOptionalArgs[key]}`)
    .join(' ');

  const cmd = `forge script script/Counter.s.sol:CounterScript --broadcast --rpc-url ${rpcUrl} --json --sender ${wallet.address} --mnemonics "${mnemonic}" ${options}`;
  return cmd;
};

void deploy();
