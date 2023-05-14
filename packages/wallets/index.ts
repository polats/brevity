import { Wallet } from "@rainbow-me/rainbowkit";
import { Chain, Connector } from "wagmi";
import {
  BlacksmithSigner,
  BlacksmithWalletOptions,
  BlacksmithWalletProvider,
} from "../core/wallet";
import { BlacksmithConnector } from "../core/connector";

const connector = ({
  chains,
}: {
  chains: Chain[];
}): Connector<
  BlacksmithWalletProvider,
  BlacksmithWalletOptions,
  BlacksmithSigner
> => {
  return new BlacksmithConnector({ chains });
};

export const blacksmithWallet = ({
  chains,
}: {
  chains: Chain[];
}): Wallet<
  Connector<BlacksmithWalletProvider, BlacksmithWalletOptions, BlacksmithSigner>
> => ({
  id: "blacksmith",
  name: "Blacksmith",
  iconUrl: "/icon.png",
  iconBackground: "#ffffff",
  createConnector: () => ({ connector: connector({ chains }) }),
});
