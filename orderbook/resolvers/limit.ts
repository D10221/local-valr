import { createResolver } from "../../resolver";
import uid from "../../util";
import { invertSide } from "../sides";
import { actions } from "../slice";
import * as select from "../select";
import trade from "./trade";
import validate from "./validate";
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

    const orderbook = select.orderbook(state);

    const orders = select.orderedSide(
      currencyPair,
      invertSide(side)
    )(orderbook);

    const limit = select.findByRequestid(requestid)(orderbook);

    const [tradedLimit, tradedOrders] = trade(orders, limit);

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
