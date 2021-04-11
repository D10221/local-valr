import { isValidFloat } from "../util";
import * as currencyPairs from "./currency-pairs";
import { isValidSide, SIDES } from "./sides";
import { LimitRequest } from "./types";
/** */
export default {
  limitRequest: (x: LimitRequest): x is LimitRequest => {
    if (!currencyPairs.isCurrencyPair(x.currencyPair)) {
      throw new ValidationError(
        `BAD 'currencyPairs' [${currencyPairs.CURRENCY_PAIRS.join("|")}]`
      );
    }
    if (!isValidSide(x.side)) {
      throw new ValidationError(`BAD 'side' [${SIDES.join("|")}]`);
    }
    if (!isValidFloat(x.price)) {
      throw new ValidationError(`BAD 'price'`);
    }
    if (!isValidFloat(x.quantity)) {
      throw new ValidationError(`BAD 'quantity'`);
    }
    return true;
  },
};
/** */
export class ValidationError extends Error {
  code = 400;
}
