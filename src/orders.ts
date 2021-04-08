import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { groupBy, sortBy, sum, take } from "ramda";
import * as currencyPairs from "./currency-pairs";
import type { State } from "./state";
import { LimitRequest, Order, OrderBook, Orders } from "./types";

const all = (state: State) => Object.values(state.orders);
const sortByPrice = sortBy((x: Order) => x.price);
const byCurrencyPair = currencyPairs.selector(all);
const groupBySide = groupBy((x: Order) => x.side);
const groupByPrice = groupBy((x: Order) => x.price);
/** ??? */
function aggregate(asks: Order[]) {
  return Object.values(groupByPrice(asks)).map((x) => {
    return {
      ...x[0],
      quantity: sum(x.map((x) => parseFloat(x.quantity))).toString(),
      orderCount: x.length,
    } as OrderBook;
  });
}
/** Selectors */
export const select = {
  raw: (state: State) => state.orders,
  all,
  byCurrencyPair,
  /**
   * @description returns a list of the top 40 bids and asks in the order book.
   * Ask orders are sorted by price ascending.
   * Bid orders are sorted by price descending.
   * Orders of the same price are aggregated.
   */
  orderbook: (currencyPair: string) => (state: State) => {
    {
      const records = byCurrencyPair(currencyPair)(state);
      var ret = groupBySide(records);
      return {
        asks: take(40, aggregate(sortByPrice(ret.SELL ?? []))),
        bids: take(40, aggregate(sortByPrice(ret.BUY ?? [])).reverse()),
      };
    }
  },
};
/** Redux's store's slice*/
const slice = createSlice({
  name: "orders",
  initialState: {} as Orders,
  reducers: {
    limit: (
      state,
      {
        payload: [id, { customerOrderId, price, quantity, side, currencyPair }],
      }: PayloadAction<[string, LimitRequest]>
    ) => {
      state[id] = {
        id,
        currencyPair,
        price,
        quantity,
        side,
        customerOrderId,
      };
    },
  },
});
export const actions = slice.actions;
/** */
export default slice;
