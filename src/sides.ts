import { equals } from "ramda";
import { Side } from "./types";

export const values: Side[] = ["SELL", "BUY"];

export function isValid(x: any): x is Side {
  return !!values.find(equals(x));
}
