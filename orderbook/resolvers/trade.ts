import { sortByPriceFrom } from "../select/sort-by-price";
import { sortByTime } from "../select/sort-by-time";
import { Order, invertSide, toOrder, toOrderInput } from "../types";
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
        parseFloat(x.price) <= parseFloat(limit.price)
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
          [next.price]: {
            key: next.price,
            price: parseFloat(next.price),
            orders,
            count: orders.length,
            quantity: orders.reduce((a, b) => a + parseFloat(b.quantity), 0),
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
  let tradedlimit = toOrderInput(limit);
  return [
    /* limit  */ toOrder(tradedlimit),
    /* orders */ Array.from(
      (function* () {
        for (let { orders } of bookEntries) {
          const input = orders.sort(sortByTime).map(toOrderInput);
          for (let o of input) {
            if (tradedlimit.balance <= 0) return;
            const b1 = tradedlimit.balance - o.balance;
            if (b1 >= 0) {
              // min ?
              tradedlimit.balance = b1;
              o.balance = o.quantity - b1;
              yield toOrder(o);
            }
          }
        }
      })()
    ),
  ];
}
