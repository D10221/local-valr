import { filter, pipe, values } from "ramda";
import { createResolver } from "../../resolver";
import uid from "../../util";
import orderbook from "../select";
import { actions } from "../slice";
import { Order } from "../types";
import validate from "../validate";
import trade from "./trade";
/**
 * ONLY TRADING LIMIT
 * It should trade the whole orderbook of every request
 * both sides
 */
export default createResolver(
  async ({ store, body: { currencyPair, quantity, price, side } }) => {
    const { createOrder, updateOrders: update } = actions(store);

    const requestid = uid();
    // ..
    const payload = {
      requestid,
      currencyPair,
      quantity,
      price,
      side,
    };
    // ...
    validate.limitRequest(payload);

    createOrder(payload);

    const state = store.getState();

    const getOrders = pipe(
      orderbook,
      values,
      filter((x: Order) => x.currencyPair === currencyPair)
    );

    const limit = getOrders(state).find((x) => x.requestid === requestid);

    const [tradedLimit, tradedOrders] = trade(getOrders(state), limit);

    const traded = Boolean(tradedOrders.length);
    if (traded) {
      // *simplistic*
      // Update orderbook ,
      // there is no accounts
      // there is no uses
      // it should balance accounts too,
      update(tradedOrders);
    }

    return {
      id: limit?.id,
      requestid,
      // transaction balance
      balance: tradedLimit.balance,
      traded,
    };
  }
);
