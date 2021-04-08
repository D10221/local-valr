import { Store } from "@reduxjs/toolkit";
import { equals } from "ramda";
import * as currencyPairs from "./currency-pairs";
import * as sides from "./sides";
import { State } from "./state";
import { LimitRequest } from "./types";
/** */
export default function validate(store: Store<State>) {
  return {
    limitRequest: (x: LimitRequest): x is LimitRequest => {
      if (!currencyPairs.isValid(x.currencyPair)) {
        throw new ValidationError(
          `BAD 'currencyPairs' [${currencyPairs.values.join("|")}]`
        );
      }
      if (!sides.isValid(x.side)) {
        throw new ValidationError(`BAD 'side' [${sides.values.join("|")}]`);
      }
      if (!validNumber(x.price)) {
        throw new ValidationError(`BAD 'price'`);
      }
      if (!validNumber(x.quantity)) {
        throw new ValidationError(`BAD 'quantity'`);
      }
      if (
        // TODO: selector or keep loose reference ?
        Object.values(store.getState().orders)
          .map((x) => x.customerOrderId)
          .find(equals(x.customerOrderId))
      ) {
        throw new ValidationError(`BAD 'customerOrderId' (exists)`);
      }
      return true;
    },
  };
}

function validNumber(x: any) {
  var n = parseFloat(x);
  return !isNaN(n) && isFinite(n);
}

export class ValidationError extends Error {
  code = 400;
}
