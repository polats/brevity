import { Contracts } from "../contracts";
import { Footer } from "../footer";
import { Header } from "../header";
import { Wallet } from "../wallet";
import { useToggle } from "../../hooks";
import Head from "next/head";
import { ReactElement } from "react";
import { ExampleProps } from "../../hooks/useExamples";

export const Layout = ( { children }: { example: ExampleProps, setExample: any, children: ReactElement<any, any> }) => {
  const { state: isWalletOpen, toggle: toggleWallet } = useToggle(false);
  const walletButtonText = isWalletOpen ? "close wallet" : "open wallet";

  return (
    <section className="text-black dark:text-white dark:bg-black min-h-screen max-h-screen flex flex-col overflow-hidden selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <Head>
        <title>Brevity</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Brevity is full-stack dapp template project using foundry and next.js."
        />
      </Head>
      <Header example={children.props.example} setExample={children.props.setExample} toggleWallet={toggleWallet} walletButtonText={walletButtonText} />
      <main className="bg-white dark:bg-black flex flex-col md:flex-row flex-grow overflow-y-auto overscroll-none">
        <aside className="flex flex-col bg-white dark:bg-black border-b border-black dark:border-white md:border-b-0 md:border-r p-2 w-full md:static md:basis-1/5 md:overflow-y-auto md:overscroll-none min-w-fit">
          <h2 className="font-bold">Contracts</h2>
          <Contracts />
          <Footer />
        </aside>
        <section className="flex flex-col flex-grow bg-white dark:bg-black p-2 overflow-y-auto md:overscroll-none">
          {children}
        </section>
        <Wallet open={isWalletOpen} />
      </main>
    </section>
  );
};
