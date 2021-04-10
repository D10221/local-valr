import { BUY, invertSide } from "../sides";
import { Order } from "../types";
import { convert, convertBack } from "./order-input";
/** */
export default function trade(orders: Order[], limit: Order): [Order, Order[]] {
  const book = orders
    .sort((a, b) => {
      const p1 = parseFloat(a.price);
      const p2 = parseFloat(b.price);
      const sort = p1 > p2 ? 1 : p1 < p2 ? -1 : 0;
      return limit.side === BUY ? sort : sort * -1;
    })
    .filter((x) => x.side === invertSide(limit.side))
    .filter((x) => parseFloat(x.price) <= parseFloat(limit.price))
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
  let tradedlimit = convert(limit);
  return [
    convertBack(tradedlimit),
    Array.from(
      (function* () {
        for (let entry of bookEntries) {
          if (tradedlimit.balance <= 0) return;
          for (let o of entry.orders.map(convert)) {
            if (tradedlimit.balance <= 0) return;
            const b1 = tradedlimit.balance - o.balance; // transaction balance
            if (b1 >= 0) {
              // min ?
              tradedlimit.balance = b1;
              o.balance = o.quantity - b1;
              yield convertBack(o);
            }
          }
        }
      })()
    ),
  ];
}
