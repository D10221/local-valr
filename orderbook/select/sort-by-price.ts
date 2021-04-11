import { sort } from "ramda";
import { BUY } from "../sides";
import { Order } from "../types";
/**  sort by price asc/desc BUY/SELL asumes all orders of the same kind */
export const sortByPrice = (asc = (o: Order) => o.side === BUY) => (
  a: Order,
  b: Order
) => {
  const ret = a.price === b.price ? 0 : a.price > b.price ? 1 : -1;
  return asc(a) ? ret : ret * -1;
};
/** use 'other' order to determine asc|desc */
export const sortByPriceFrom = (o: Order) => sortByPrice(() => o.side === BUY);

export default sort(sortByPrice((a) => a.side === BUY));
