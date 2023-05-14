import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import type { Address, ContractDetails } from "../types";

const LOCALHOST_CHAIN_ID = "31337";

type Contracts = {
  [key: Address]: ContractDetails;
};

type Data = {
  [LOCALHOST_CHAIN_ID]: Contracts;
};

const file = "contractInfo.json";
const adapter = new JSONFile<Data>(file);

const defaultData: Data = { [LOCALHOST_CHAIN_ID]: {} };
const db = new Low(adapter, defaultData);

export { db };
