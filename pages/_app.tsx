import "styles/globals.css";
import { Inter, Source_Code_Pro } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import {
  RainbowKitProvider,
  connectorsForWallets,
  darkTheme,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  injectedWallet,
  rainbowWallet,
  walletConnectWallet
} from "@rainbow-me/rainbowkit/wallets";
import { ThemeProvider } from "next-themes";
import { WagmiConfig, configureChains, createClient } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { blacksmithWallet } from "../packages/wallets";
import { mainnet, sepolia, goerli, polygonMumbai } from "wagmi/chains";
import { foundry } from "../core/chains";
import { Layout } from "../components/layout";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { EXAMPLES_LIST, BLANK_EXAMPLE, useExamples } from "../hooks/useExamples";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-source-code-pro",
});

const { chains, provider, webSocketProvider } = configureChains(
  [foundry, mainnet, sepolia, goerli, polygonMumbai],
  [publicProvider()]
);

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      injectedWallet({ chains }),
      metaMaskWallet({ chains })
    ]
  },
  {
    groupName: "Foundry (requires local anvil node)",
    wallets: [blacksmithWallet({ chains })],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

const MyApp = ({ Component, pageProps }: AppProps) => {
  
  const router = useRouter();
  const { example, setExample } = useExamples();

  const setExampleIfPathFound = (path: string) => {

    const foundExample = EXAMPLES_LIST.find((example) => example.path === path);
    if (foundExample) {    
        setExample(foundExample);
        return;
    }

    setExample(BLANK_EXAMPLE);
}

  useEffect(() => {
    setExampleIfPathFound(router.pathname);
  }, [router]);

  return (
    <div className={`${inter.variable} ${sourceCodePro.variable} font-sans`}>
      <ThemeProvider attribute="class" disableTransitionOnChange={true}>
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider
            appInfo={{
              appName: "Brevity",
              learnMoreUrl: "https://github.com/polats/brevity",
            }}
            chains={chains}
            theme={{
              darkMode: darkTheme({
                accentColor: "#00ac8e",
                accentColorForeground: "#262a33",
                borderRadius: "small",
              }),
              lightMode: lightTheme({
                accentColor: "#262a33",
                accentColorForeground: "#00ac8e",
                borderRadius: "small",
              }),
            }}
          >
            <Layout example={example} setExample={setExample}>
              <Component example={example} setExample={setExample} {...pageProps} />
            </Layout>
          </RainbowKitProvider>
        </WagmiConfig>
      </ThemeProvider>
    </div>
  )
}

export default MyApp;
