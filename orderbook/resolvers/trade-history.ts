import { pipe } from "ramda";
import { createResolver } from "../../resolver";
import { isValidFloat } from "../../util";
import roundNumber from "../round";
import orderbook from "../select";
import tradeHistory from "../select/trade-history";
import { isCurrencyPair } from "../types";
import { ValidationError } from "../validate";
import toString from "../to-string";
/**
 * @description Get the trade history for a given currency pair.
 * The results of this request may be filtered by datetime.
 * The skip and limit parameters may be applied to paginate the filtered results.
 */
export default createResolver(
  async ({ store, params: { currencyPair }, query }) => {
    if (!isCurrencyPair(currencyPair)) {
      throw new ValidationError("BAD 'currencyPair'");
    }
    return pipe(
      orderbook,
      tradeHistory(
        currencyPair,
        (isValidFloat(query?.skip) && query.skip) || undefined,
        (isValidFloat(query?.limit) && query.limit) || undefined
      )
    )(store.getState()).map(
      ({ currencyPair, id, price, quantity, sequenceId, takerSide }) => ({
        currencyPair,
        id,
        price: toString(roundNumber(price)),
        quantity: toString(roundNumber(quantity)),
        sequenceId,
        takerSide,
      })
    );
  }
);
