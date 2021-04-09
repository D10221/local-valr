import { createSlice, Store, bindActionCreators } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import uid from "./util";
import type { LimitRequest, Order, Orderbook } from "./types";

/** Redux's store's slice*/
const slice = createSlice({
  name: "orderbook",
  initialState: {} as Orderbook,
  reducers: {
    createLimitOrder: (
      state: Orderbook,
      { payload }: PayloadAction<LimitRequest>,
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
    balance: (state: Orderbook, { payload }: PayloadAction<Order[]>) => {
      for (let order of payload) {
        state[order.id] = {
          ...order,
          // balance: TODO
        };
      }
    },
  },
});

export const actions = (store: Store) =>  bindActionCreators(slice.actions, store.dispatch);

/** */
export default slice;
