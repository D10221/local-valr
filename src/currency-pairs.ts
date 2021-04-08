import { equals } from "ramda";
import type { State } from "./state";
import { CurrencyPair } from "./types";
/** TODO : readonly|immutable */
export const values: ReadonlyArray<CurrencyPair> = [
  "BTCZAR",
  "ETHZAR",
  "XRPZAR",
];
/** type assertion */
export function isValid(x: any): x is CurrencyPair {
  return Boolean(values.find(equals(x)));
}
/** Generic filter */
export function filter<T extends { currencyPair: CurrencyPair }>(
  currencyPair: string
) {
  return (x: T) =>
    Boolean(currencyPair) &&
    x.currencyPair?.toLowerCase() === // use Regex?
      currencyPair?.toLocaleLowerCase();
}
/**
 * Generic Selector
 */
export function selector<T extends { currencyPair: CurrencyPair }>(
  select: (state: State) => T[]
) {
  return (currencyPair: string) => (state: State): T[] =>
    Object.values(select(state)).filter(filter(currencyPair));
}
