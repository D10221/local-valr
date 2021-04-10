import { randomBytes } from "crypto";
import { groupBy, map, pipe, sum } from "ramda";
/** */
export const filter = <T>(f: (x: T) => boolean) => (list: T[]) =>
  list.filter(f);
/** */
export const find = <T>(f: (t: T) => boolean) => (list: T[]) => list.find(f);
/** */
export const aggregate = <T>(f: (x: T) => string) => (entries: T[]) => ({
  ...entries[0],
  quantity: sum(entries.map((x) => parseFloat(f(x)))).toString(),
  count: entries.length,
});
/** */
export const aggregateBy = <T>(prop: (x: T) => any) =>
  pipe(groupBy(prop), Object.values, map(aggregate(prop)));
/** */
export const toList = <T>(o: { [key: string]: T }) => Object.values(o);
/** typescript helper  */
export const toListOf = <T>() => (o: { [key: string]: T }) => Object.values(o);
/** */
export const findBy = <T>(f: (x: T) => boolean) => pipe(toList, find(f));
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
