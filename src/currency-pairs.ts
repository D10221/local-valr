import type { CurrencyPair, State } from "./state";
/** */
export function filter<T extends { currencyPair: CurrencyPair }>(
  currencyPair: string
) {
  return (x: T) =>
    Boolean(currencyPair) &&
    x.currencyPair?.toLowerCase() === // use Regex?
      currencyPair?.toLocaleLowerCase();
}
/** */
export function selector<T extends { currencyPair: CurrencyPair }>(
  select: (state: State) => T[]
) {
  return (currencyPair: string) => (state: State): T[] =>
    Object.values(select(state)).filter(filter(currencyPair));
}
