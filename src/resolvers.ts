import * as currencyPairs from "./currency-pairs";
import * as orderbookStore from "./orderbook";
import * as select from "./select";
import resolver from "./resolver";
import validate, { ValidationError } from "./validate";
import { pipe } from "ramda";
import uid, { isValidFloat } from "./util";
import { invertSide } from "./sides";
import { Order } from "./types";
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
          (isValidFloat(query?.limit) && query.limit) || undefined,
        ),
      )(store.getState());
    },
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
      const { createLimitOrder, balance } = orderbookStore.actions(store);

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
      // ...
      createLimitOrder(payload);
      // ...
      const state = store.getState();
      const orderbook = select.raw(state);

      const orders = select.orderedSide(
        currencyPair,
        invertSide(side),
      )(orderbook);

      const limit = convert(select.findByRequestid(requestid)(orderbook));

      const traded = orders.map(convert).reduce(
        (out, order) => {
          // sell
          if (
            order.balance >= out.limit.balance &&
            order.price <= out.limit.price
          ) {
            const limit = {
              ...out.limit,
              balance: out.limit.balance - order.balance,
            };
            const traded = {
              ...order,
              quantity: order.balance - limit.balance,
            };
            return {
              ...out,
              limit,
              orders: [...out.orders, traded].map(convertBack),
            };
          }
          return out;
        },
        // seed
        {
          limit: {
            quantity: limit.quantity,
            price: limit.price,
            balance: limit.balance,
          },
          orders: [] as Order[],
        },
      );

      balance(traded.orders);

      console.log(store.getState());

      return {
        id: limit?.id,
        requestid,
        // transaction balance
        balance: traded.limit.quantity,
      };
    },
  ),
};
/** */
function convert({
  quantity,
  price,
  balance,
  ...order
}: Order): Omit<Order, "quantity" | "price" | "balance"> & {
  quantity: number;
  price: number;
  balance: number;
} {
  return {
    ...order,
    quantity: parseFloat(quantity),
    price: parseFloat(price),
    balance: parseFloat(balance),
  };
}
/** */
function convertBack({
  quantity,
  price,
  balance,
  ...order
}: Omit<Order, "quantity" | "price" | "balance"> & {
  quantity: number;
  price: number;
  balance: number;
}) {
  return {
    ...order,
    quantity: quantity.toString(),
    price: price.toString(),
    balance: balance.toString(),
  };
}
