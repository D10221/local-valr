import { filter, groupBy, map, pipe, sum } from "ramda";
import { CurrencyPair, Order } from "../types";
import sortByPrice from "./sort-by-price";
import { toList } from "../../util";
/**
 * @description returns
 * Ask orders are sorted by price ascending.
 * Bid orders are sorted by price descending.
 * Orders of the same price are aggregated.
 */
export default (currencyPair: CurrencyPair) =>
  pipe(
    toList<Order>(),
    filter((x: Order) => x.currencyPair === currencyPair),
    groupBySide,
    map(sortByPrice),
    map(aggregateBy((x) => x.price))
  );
/** */
const aggregate = <T>(f: (x: T) => string) => (entries: T[]) => ({
  ...entries[0],
  quantity: sum(entries.map((x) => parseFloat(f(x)))).toString(),
  count: entries.length,
});
/** */
const aggregateBy = <T>(prop: (x: T) => any) =>
  pipe(groupBy(prop), Object.values, map(aggregate(prop)));
/** */
const groupBySide = pipe(
  groupBy((x: Order) => x.side),
  ({ BUY, SELL }) => [SELL || [], BUY || []]
);
