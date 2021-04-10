import { BUY, SELL } from "../sides";
import { Order } from "../types";
import { convert, convertBack } from "./order-input";
/** */
export default function trade(limit: Order, orders: Order[]): [Order, Order[]] {
  const { side } = limit;
  // numbers
  return orders.reduce(
    ([limit, orders], order) => {
      switch (side) {
        case SELL: {
          if (order.balance < limit.balance || order.price > limit.price) {
            return [limit, orders];
          }
          const [_limit, traded] = sell(limit, order);
          return [_limit, [...orders, traded]];
        }
        case BUY: {
          if (order.balance > limit.balance || order.price < limit.price) {
            return [limit, orders];
          }
          const [_limit, traded] = buy(limit, order);
          return [_limit, [...orders, traded]];
        }
        default: {
          throw new Error(`BAD side '${side}'`);
        }
      }
    },
    // seed
    [limit, orders]
  );
}
/** TODO */
function sell(limit: Order, order: Order): [Order, Order] {
  const l = convert(limit);
  const o = convert(order);
  const _limit = {
    ...l,
    balance: l.balance - o.balance,
  };
  const traded = {
    ...o,
    quantity: o.balance - l.balance,
  };

  return [convertBack(_limit), convertBack(traded)];
}
/** TODO */
function buy(limit: Order, order: Order): [Order, Order] {
  const l = convert(limit);
  const o = convert(order);
  const _limit = {
    ...l,
    balance: l.balance - o.balance,
  };
  const traded = {
    ...o,
    quantity: o.balance - l.balance,
  };
  return [convertBack(_limit), convertBack(traded)];
}
