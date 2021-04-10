import { groupBy, map, pipe, slice, sort } from "ramda";
import {
  aggregateBy,
  filter,
  findBy,
  mapi,
  toList,
  toListOf,
} from "../../util";
import { selector } from "../slice";
import { CurrencyPair, Order, Orderbook, Side } from "../types";
/** */
export const orderbook = selector;
/** */
export const findByRequestid = (requestid: string) =>
  findBy<Order>((x) => x.requestid === requestid);
/** */
export const sortByPrice = sort((a: Order, b: Order) => {
  const ret = a.price === b.price ? 0 : a.price > b.price ? 1 : -1;
  return a.side === "BUY" ? ret : ret * -1;
});
/** Generic filter */
export function filterCurreny<T extends { currencyPair: CurrencyPair }>(
  currencyPair: string
) {
  return (x: T) => Boolean(currencyPair) && x.currencyPair === currencyPair;
}
/** */
export const groupBySide = pipe(
  groupBy((x: Order) => x.side),
  ({ BUY, SELL }) => [SELL || [], BUY || []]
);
/**
 * @description returns
 * Ask orders are sorted by price ascending.
 * Bid orders are sorted by price descending.
 * Orders of the same price are aggregated.
 */
export const orderedBook = (currencyPair: CurrencyPair) =>
  pipe(
    toListOf<Order>(),
    filter(filterCurreny(currencyPair)),
    groupBySide,
    map(sortByPrice),
    map(aggregateBy((x) => x.price))
  );
/** */
export const orderedSide = (currencyPair: CurrencyPair, side: Side) =>
  pipe(
    toListOf<Order>(),
    filter(filterCurreny(currencyPair)),
    filter((x) => x.side === side),
    sortByPrice
  );
/** */
export type TradeHistoryEntry = {
  price: string;
  quantity: string;
  currencyPair: CurrencyPair;
  // "tradedAt": "2020-11-30T08:55:29.338087Z",
  takerSide: Side;
  sequenceId: number;
  id: string;
  // "quoteVolume": "45726.7632"
};
/** */
export const toTradeHistory = (
  { price, quantity, currencyPair, id, side: takerSide }: Order,
  sequenceId?: number
): TradeHistoryEntry => ({
  price,
  quantity,
  currencyPair,
  // "tradedAt": "2020-11-30T08:55:29.338087Z",
  takerSide,
  sequenceId,
  id,
  // "quoteVolume": "45726.7632"
});
/** */
export const tradeHistory = (
  currencyPair: CurrencyPair,
  skip?: number,
  limit?: number
) =>
  pipe(
    (orderbook: Orderbook) => orderbook,
    toList,
    filter(filterCurreny(currencyPair)),
    mapi(toTradeHistory),
    slice(skip, limit),
    /** Type Bug somewhere */
    (x: TradeHistoryEntry[]) => x
  );
