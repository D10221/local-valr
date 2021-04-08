import { Store } from "@reduxjs/toolkit";
import { equals } from "ramda";
import { CurrencyPair, LimitRequest, Side, State } from "./state";

const currencyPairs: CurrencyPair[] = ["BTCZAR", "ETHZAR", "XRPZAR"];

export function isCurrencyPair(x: any): x is CurrencyPair {
  return !!currencyPairs.find(equals(x));
}

export default function validatestore(store: Store<State>) {
  const sides: Side[] = ["SELL", "BUY"];

  return {
    limitRequest: (x: LimitRequest): x is LimitRequest => {
      if (!isCurrencyPair(x.currencyPair)) {
        throw new ValidationError(
          `BAD 'currencyPairs' [${currencyPairs.join()}]`
        );
      }
      if (!sides.find(equals(x.side))) {
        throw new ValidationError(`BAD 'side' [${sides.join()}]`);
      }
      if (!validNumber(x.price)) {
        throw new ValidationError(`BAD 'price'`);
      }
      if (!validNumber(x.quantity)) {
        throw new ValidationError(`BAD 'quantity'`);
      }
      if (
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
