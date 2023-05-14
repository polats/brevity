import { db } from "../database";
import type { Address, ContractDetails } from "../types";

const LOCALHOST_CHAIN_ID = "31337";

const insert = async (data: ContractDetails) => {
  await db.read();
  (db.data as any).contracts[data.address] = data;
  return db.write();
};

const findAll = async () => {
  await db.read();

  return Object.values(db.data[LOCALHOST_CHAIN_ID] || {});
};

const remove = async (address: Address) => {
  await db.read();
  delete (db.data as any).contracts[address];
  return db.write();
};

const removeAll = async () => {
  await db.read();
  (db.data as any).contracts = {};
  return db.write();
};

export const contract = {
  insert,
  findAll,
  remove,
  removeAll,
};
