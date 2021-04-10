import { pipe } from "ramda";
import { createResolver } from "../../resolver";
import { isValidFloat } from "../../util";
import { isCurrencyPair } from "../currency-pairs";
import * as select from "../select";
import { ValidationError } from "./validate";

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
      select.orderbook,
      select.tradeHistory(
        currencyPair,
        (isValidFloat(query?.skip) && query.skip) || undefined,
        (isValidFloat(query?.limit) && query.limit) || undefined
      )
    )(store.getState());
  }
);
