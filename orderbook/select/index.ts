import { groupBy, map, pipe, slice } from "ramda";
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
import sortByPrice from "./sort-by-price";
export { sortByPrice } 
/** */
export const orderbook = selector;
/** */
export const findByRequestid = (requestid: string) =>
  findBy<Order>((x) => x.requestid === requestid);  
/** Generic filter */
export function filterCurrency<T extends { currencyPair: CurrencyPair }>(
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
    filter(filterCurrency(currencyPair)),
    groupBySide,
    map(sortByPrice),
    map(aggregateBy((x) => x.price))
  );

export const filterBySide = (side: Side) =>
  filter((x: Order) => x.side === side);

/** */
export const orderedSide = (currencyPair: CurrencyPair, side: Side) =>
  pipe(
    toListOf<Order>(),
    filter(filterCurrency(currencyPair)),
    filterBySide(side),
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
    filter(filterCurrency(currencyPair)),
    mapi(toTradeHistory),
    slice(skip, limit),
    /** Type Bug somewhere */
    (x: TradeHistoryEntry[]) => x
  );
