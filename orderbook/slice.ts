import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import uid from "../util";
import { LimitRequest, Order, Orderbook } from "./types";
import { Store, bindActionCreators } from "@reduxjs/toolkit";
/**
 * Redux's store's slice ... database like
 * */
const slice = createSlice({
  name: "orderbook",
  initialState: {} as Orderbook,
  reducers: {
    createOrder: (
      state: Orderbook,
      { payload }: PayloadAction<LimitRequest>
    ) => {
      const { requestid, currencyPair, price, quantity, side } = payload;
      const id = uid();
      state[id] = {
        id,
        currencyPair,
        price,
        quantity,
        side,
        requestid,
        balance: quantity,
        // createdAt: Date.now()
      };
    },
    updateOrders: (state: Orderbook, { payload }: PayloadAction<Order[]>) => {
      for (let order of payload) {
        state[order.id] = {
          ...order,
        };
      }
    },
  },
});
export const selector = (state: { orderbook: Orderbook }) => state.orderbook;
export const actions = (store: Store) =>
  bindActionCreators(slice.actions, store.dispatch);

export default slice.reducer;
