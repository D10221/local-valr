import { createResolver } from "../../resolver";
import orderbook from "../select";
import orderedBook from "../select/ordered-Book";
import { isCurrencyPair } from "../types";
/**
 * @description returns a list of the top 'N'' bids and asks in the order book.
 * Ask orders are sorted by price ascending.
 * Bid orders are sorted by price descending.
 * Orders of the same price are aggregated.
 */
export default createResolver(async ({ store, params: { currencyPair } }) => {
  if (!isCurrencyPair(currencyPair)) throw new Error("Bad currencyPairs");
  const state = store.getState();
  const [asks, bids] = orderedBook(currencyPair)(orderbook(state));
  return {
    asks: asks
      .map(({ count, ...x }) => ({ ...x, orderCount: count }))
      .slice(0, 40),
    bids: bids
      .map(({ count, ...x }) => ({ ...x, orderCount: count }))
      .slice(0, 40),
  };
});
