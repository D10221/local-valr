import * as currencyPairs from "./currency-pairs";
import * as orders from "./orders";
import resolver from "./resolver";
import * as tradeHistory from "./trade-history";
import uid from "./uid";
import validate, { ValidationError } from "./validate";
/** */
export default {
  /** */
  tradeHistory: resolver.create(async ({ store, params: { currencyPair } }) => {
    const state = store.getState();
    if (!currencyPairs.isValid(currencyPair)) {
      throw new ValidationError("BAD 'currencyPair'");
    }
    return tradeHistory.select.tradehistory(
      state,
      currencyPair,
      orders.select.raw(state)
    );
  }),
  /** */
  orderbook: resolver.create(async ({ store, params: { currencyPair } }) =>
    orders.select.orderbook(currencyPair)(store.getState())
  ),
  /** */
  limit: resolver.create(async ({ store, body }) => {
    const _validate = validate(store);
    _validate.limitRequest(body);
    const id = uid();
    store.dispatch(orders.actions.limit([id, body]));
    store.dispatch(tradeHistory.actions.add(id));
    return "done";
  }),
};
