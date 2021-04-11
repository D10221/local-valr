import round from "./round";
import { sortByPriceFrom } from "./select/sort-by-price";
import { sortByTime } from "./select/sort-by-time";
import { Order, invertSide } from "./types";
/**
 * takes orders , limit where order side != limit.side
 * returns traded limit and traded orders
 */
export default function trade(orders: Order[], limit: Order): [Order, Order[]] {
  const book = orders
    .filter(
      (x) =>
        // order side != limit.side
        x.side === invertSide(limit.side) &&
        // filter limit price
        x.price <= limit.price
    )
    // sort by price
    .sort(sortByPriceFrom(limit))
    // group by price
    .reduce(
      (out, next, index) => {
        const prev = out[next.price] ?? { orders: [] as Order[] };
        const orders = [...(prev.orders ?? []), next];
        return {
          ...out,
          [next.price.toString()]: {
            key: next.price,
            price: next.price,
            orders,
            count: orders.length,
            quantity: orders.reduce((a, b) => round(a + b.quantity), 0),
            index,
          },
        };
      },
      {} as {
        [key: string]: {
          key: string;
          price: number;
          count: number;
          quantity: number;
          index: number;
          orders: Order[];
        };
      }
    );
  //
  const bookEntries = Object.values(book);
  let tradedlimit = { ...limit };
  return [
    /* limit  */ tradedlimit,
    /* orders */ Array.from(
      (function* () {
        for (let { orders: _orders } of bookEntries) {
          const input = _orders.sort(sortByTime);
          for (let order of input) {
            if (tradedlimit.balance <= 0 || order.balance <= 0) return;
            const limitBalance = tradedlimit.balance - order.balance;
            const orderBalance =
              order.balance - (tradedlimit.balance - limitBalance);
            if (limitBalance >= 0 && orderBalance >= 0) {
              // min ?
              tradedlimit.balance = round(limitBalance);
              order.balance = orderBalance;
              yield round(order);
            }
          }
        }
      })()
    ),
  ];
}
