import * as currencyPairs from "./currency-pairs";
import * as orderbookStore from "./orderbook";
import * as select from "./select";
import resolver from "./resolver";
import validate, { ValidationError } from "./validate";
import { pipe } from "ramda";
import uid, { isValidFloat } from "./util";
import { invertSide } from "./sides";
import trade from "./trade";
/** */
export default {
  /**
   * Get the trade history for a given currency pair.
   * The results of this request may be filtered by datetime.
   * The skip and limit parameters may be applied to paginate the filtered results.
   */
  tradeHistory: resolver.create(
    async ({ store, params: { currencyPair }, query }) => {
      if (!currencyPairs.isCurrencyPair(currencyPair)) {
        throw new ValidationError("BAD 'currencyPair'");
      }
      return pipe(
        select.raw,
        select.tradeHistory(
          currencyPair,
          (isValidFloat(query?.skip) && query.skip) || undefined,
          (isValidFloat(query?.limit) && query.limit) || undefined
        )
      )(store.getState());
    }
  ),
  /**
   * @description returns a list of the top 'N'' bids and asks in the order book.
   * Ask orders are sorted by price ascending.
   * Bid orders are sorted by price descending.
   * Orders of the same price are aggregated.
   */
  orderbook: resolver.create(async ({ store, params: { currencyPair } }) => {
    if (!currencyPairs.isCurrencyPair(currencyPair))
      throw new Error("Bad currencyPairs");
    const state = store.getState();
    const [asks, bids] = select.orderedBook(currencyPair)(select.raw(state));
    return {
      asks: asks
        .map(({ count, ...x }) => ({ ...x, orderCount: count }))
        .slice(0, 40),
      bids: bids
        .map(({ count, ...x }) => ({ ...x, orderCount: count }))
        .slice(0, 40),
    };
  }),
  /** */
  limit: resolver.create(
    async ({ store, body: { currencyPair, quantity, price, side } }) => {
      const { createOrder, updateOrders: update } = orderbookStore.actions(
        store
      );

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

      createOrder(payload); // ... database

      const state = store.getState();
      const orderbook = select.raw(state);

      const orders = select.orderedSide(
        currencyPair,
        invertSide(side)
      )(orderbook);

      const limit = select.findByRequestid(requestid)(orderbook);

      const traded = trade(limit, orders);

      if (traded.orders.length) {
        // ... database
        update(traded.orders);
      }

      console.log(store.getState());

      return {
        id: limit?.id,
        requestid,
        // transaction balance
        balance: traded.limit.quantity,
        traded: Boolean(traded.orders.length),
      };
    }
  ),
};
