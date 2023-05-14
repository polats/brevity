import { getAddress as _getAddress } from "viem";
import { Address } from "../types";

const getAddress = (address: Address) => {
  try {
    return _getAddress(address);
  } catch {
    return null;
  }
};

export { getAddress };
