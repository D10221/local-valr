import { randomBytes } from "crypto";
/**
 * typescript helper
 * specify type 1st to easy type inference
 *   */
export const toList = <T>() => (o: { [key: string]: T }) => Object.values(o);

/** rambda doesn't provide index */
export const mapi = <T, U>(fn: (x: T, i: number) => U) => (
  list: readonly T[]
): U[] => list.map(fn);
/** cheap UID */
export default function uid(length = 8) {
  return randomBytes(length).toString("hex");
}
/** */
export function isValidFloat(x: any): x is number {
  var n = parseFloat(x);
  return !isNaN(n) && isFinite(n);
}
/** */
export function isValidInt(x: any): x is number {
  var n = parseInt(x);
  return !isNaN(n) && isFinite(n);
}
