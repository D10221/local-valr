import { equals } from "ramda";

import { CurrencyPair } from "./types";
/** TODO : readonly|immutable */
export const values: ReadonlyArray<CurrencyPair> = [
  "BTCZAR",
  "ETHZAR",
  "XRPZAR",
];
/** type assertion */
export function isCurrencyPair(x: any): x is CurrencyPair {
  return Boolean(values.find(equals(x)));
}
