import { WalletIcon } from "@heroicons/react/24/outline";
import { Connect } from "../connect";
import Link from "next/link";
import { ExampleDropdown } from "../exampledropdown";

type HeaderProps = {
  toggleWallet: () => void;
  walletButtonText: string;
  setExample: (example: any) => void;
  example: string
};

export const Header = ({ toggleWallet, walletButtonText, example, setExample }: HeaderProps) => (
  <header className="bg-white dark:bg-black border-b border-black dark:border-white sticky top-0 p-2 flex items-center justify-between">
    <h1 className="font-bold">
      <Link href="/" className="top-2 focus:underline focus:outline-none">
        📜✒️ Brevity
      </Link>
      </h1>

    <ExampleDropdown example={example} setExample={setExample} />

    <section className="flex items-center gap-1">
      <Connect />
      <button
        onClick={toggleWallet}
        className="p-0.5 text-black dark:text-white rounded-sm focus:bg-black focus:text-white dark:focus:bg-white dark:focus:text-black focus:outline-none"
      >
        <WalletIcon className="w-6 h-6" />
        <span className="sr-only">{walletButtonText}</span>
      </button>
    </section>
  </header>
);
