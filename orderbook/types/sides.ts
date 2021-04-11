import { equals } from "ramda";
import { Side } from "./types";

export const SELL: Side = "SELL";
export const BUY: Side = "BUY";
export const SIDES = Object.freeze([SELL, BUY]);

export function isValidSide(x: any): x is Side {
  return !!SIDES.find(equals(x));
}

export function invertSide(side: Side) {
  switch (side) {
    case BUY:
      return SELL;
    case SELL:
      return BUY;
    default: {
      throw new Error(`Bad Side '${side}'`);
    }
  }
}
