import Link from "next/link";
import type { NextPage } from "next";

const Home: NextPage = () => (
  <>
    <h2 className="font-bold">Example Apps</h2>
    <Link
              href={`/itemizer`}
              className={`focus:underline focus:outline-none hover:bg-slate-200 focus:bg-slate-200 dark:hover:bg-white dark:hover:text-black dark:focus:bg-white dark:focus:text-black`}
            >
              ERC-6551 Itemizer: Create separate ERC-1155 based on an ERC-721's traits
            </Link>

    <Link
              href={`/indexer_example`}
              className={`focus:underline focus:outline-none hover:bg-slate-200 focus:bg-slate-200 dark:hover:bg-white dark:hover:text-black dark:focus:bg-white dark:focus:text-black`}
            >
              Wighawag Ethereum Indexer Example
            </Link>
  </>
);

export default Home;
