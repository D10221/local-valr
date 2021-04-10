import { createResolver } from "../../resolver";
import uid from "../../util";
import { invertSide } from "../sides";
import { actions } from "../slice";
import * as select from "../select";
import trade from "./trade";
import validate from "./validate";
/** */
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

    const [tradedLimit, tradedOrders] = trade(limit, orders);

    const traded = Boolean(tradedOrders.length);
    if (traded) {
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
