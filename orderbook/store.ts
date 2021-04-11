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
    createOrder: {
      reducer: (
        state: Orderbook,
        { payload }: PayloadAction<LimitRequest & { id: string }>
      ) => {
        const { currencyPair, price, quantity, side, id } = payload;
        state[id] = {
          id,
          currencyPair,
          price,
          quantity,
          side,
          balance: quantity,
          createdAt: Date.now(),
        };
      },
      prepare: (req: LimitRequest) => ({ payload: { ...req, id: uid() } }),
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
/**
 * Store's slice
 * don't like name slice. it's abiguos, and too Redux specific
 *
 *  */
export default slice.reducer;
