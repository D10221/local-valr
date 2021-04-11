import { pipe, slice, filter, values } from "ramda";
import { mapi } from "../../util";
import { CurrencyPair, Order, Orderbook, Side } from "../types";
/** */
export type TradeHistoryEntry = {
  price: string;
  quantity: string;
  currencyPair: CurrencyPair;
  // "tradedAt": "2020-11-30T08:55:29.338087Z",
  takerSide: Side;
  sequenceId: number;
  id: string;
};
/** */
const toTradeHistory = (
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
