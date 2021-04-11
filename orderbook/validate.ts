import { isValidFloat } from "../util";
import {
  CURRENCY_PAIRS,
  isCurrencyPair,
  isValidSide,
  LimitRequest,
  SIDES,
} from "./types";
/** */
export default {
  limitRequest: (x: LimitRequest): x is LimitRequest => {
    if (!isCurrencyPair(x.currencyPair)) {
      throw new ValidationError(
        `BAD 'currencyPairs' [${CURRENCY_PAIRS.join("|")}]`
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
