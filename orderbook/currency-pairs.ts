import { equals } from "ramda";

import { CurrencyPair } from "./types";
export const BTCZAR: CurrencyPair = "BTCZAR";
export const ETHZAR: CurrencyPair = "ETHZAR";
export const XRPZAR: CurrencyPair = "XRPZAR";
/** */
export const CURRENCY_PAIRS: ReadonlyArray<CurrencyPair> = Object.freeze([
  BTCZAR,
  ETHZAR,
  XRPZAR,
]);
/** type assertion */
export function isCurrencyPair(x: any): x is CurrencyPair {
  return Boolean(CURRENCY_PAIRS.find(equals(x)));
}
