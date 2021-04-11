import { filter, find, pipe, values } from "ramda";
import { createResolver } from "../../resolver";
import orderbook from "../select";
import { actions } from "../store";
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
    const getOrders = pipe(
      orderbook,
      values,
      filter((x: Order) => x.currencyPair === currencyPair)
    );

    const getRecord = (id: string) =>
      pipe(
        store.getState,
        getOrders,
        find((x: Order) => x.id === id)
      )();

    const { createOrder, updateOrders: update } = actions(store);
    // ..
    const payload = {
      currencyPair,
      quantity,
      price,
      side,
    };
    // ...
    validate.limitRequest(payload);

    const {
      payload: { id },
    } = createOrder(payload);

    const [tradedLimit, tradedOrders] = trade(
      getOrders(store.getState()),
      getRecord(id)
    );

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
      id: tradedLimit?.id,
      // transaction balance
      balance: tradedLimit.balance,
      traded,
    };
  }
);
