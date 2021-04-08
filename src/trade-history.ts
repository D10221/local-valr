import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as currencyPairs from "./currency-pairs";
import type {
  CurrencyPair,
  Orders,
  State,
  TradeHistory,
  TradeHistoryRecord,
} from "./state";
const slice = createSlice({
  name: "tradeHistory",
  initialState: {} as TradeHistory,
  reducers: {
    add(state, { payload }: PayloadAction<string>) {
      state[Object.keys(state).length] = {
        orderid: payload,
        tradedAt: new Date().toISOString(),
      };
    },
  },
});
export const actions = slice.actions;
/** */
export default slice;
/** */
export const select = {
  all(state: State): TradeHistoryRecord[] {
    return Object.keys(state.tradeHistory).map((id) => ({
      id,
      ...state.tradeHistory[id],
    }));
  },
  tradehistory(state: State, currencyPair: CurrencyPair, orders: Orders) {
    return select
      .all(state)
      .map((x) => ({
        ...orders[x.orderid],
        ...x,
      }))
      .filter(currencyPairs.filter(currencyPair));
  },
};
