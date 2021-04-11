import { pipe, slice, filter, values } from "ramda";
import { mapi } from "../../util";
import { CurrencyPair, Order, Orderbook, Side } from "../types";
/** */
export type TradeHistoryEntry = {
  price: number;
  quantity: number;
  currencyPair: CurrencyPair;
  // "tradedAt": "2020-11-30T08:55:29.338087Z", //not-implemented!
  /** is wrong!, not tracked */
  takerSide: Side;
  sequenceId: number;
  id: string;
};
/** takerSide is wrong!, not tracked */
const toTradeHistory = (
  { price, quantity, currencyPair, id, side: takerSide }: Order,
  sequenceId?: number
): TradeHistoryEntry => ({
  price,
  quantity,
  currencyPair,
  // "tradedAt": "2020-11-30T08:55:29.338087Z", // not-implemented!
  takerSide,
  sequenceId,
  id,
  // "quoteVolume": "45726.7632" // not-implemented!
});
/** */
export default (currencyPair: CurrencyPair, skip?: number, limit?: number) =>
  pipe(
    (orderbook: Orderbook) => orderbook,
    values,
    filter((x: Order) => x.currencyPair === currencyPair),
    mapi(toTradeHistory),
    slice(skip, limit),
    /** Type Bug somewhere */
    (x: TradeHistoryEntry[]) => x
  );
