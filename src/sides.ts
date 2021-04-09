import { equals } from "ramda";
import { Side } from "./types";

export const values: Side[] = ["SELL", "BUY"];

export function isValid(x: any): x is Side {
  return !!values.find(equals(x));
}

export function invertSide(side: Side) {
  switch (side) {
    case "BUY":
      return "SELL";
    case "SELL":
      return "BUY";
    default: {
      throw new Error(`Bad Side '${side}'`);
    }
  }
}
