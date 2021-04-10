import { Order } from "./types";
/** */
type OrderInput = Omit<Order, "quantity" | "price" | "balance"> & {
  quantity: number;
  price: number;
  balance: number;
};
/** */
export default function trade(limit: Order, orders: Order[]) {
  // numbers
  const { quantity, price, balance, side } = convert(limit);

  return orders.map(convert).reduce(
    (out, order) => {
      switch (side) {
        case "SELL": {
          const [limit, traded] = sell(out.limit, order);
          return {
            ...out,
            limit,
            orders: [...out.orders, traded].map(convertBack),
          };
        }
        case "BUY": {
          const [limit, traded] = buy(out.limit, order);
          return {
            ...out,
            limit,
            orders: [...out.orders, traded]
              //strings
              .map(convertBack),
          };
        }
        default: {
          throw new Error(`BAD side '${side}'`);
        }
      }
    },
    // seed
    {
      limit: {
        ...limit,
        quantity,
        price,
        balance,
      },
      orders: [] as Order[],
    }
  );
}
/** TODO */
function sell(limit: OrderInput, order: OrderInput) {
  if (order.balance < limit.balance || order.price > limit.price) {
    return [limit, order];
  }
  const _limit = {
    ...limit,
    balance: limit.balance - order.balance,
  };
  const traded = {
    ...order,
    quantity: order.balance - limit.balance,
  };
  return [_limit, traded];
}
/** TODO */
function buy(limit: OrderInput, order: OrderInput) {
  if (order.balance > limit.balance || order.price < limit.price) {
    return [limit, order];
  }
  const _limit = {
    ...limit,
    balance: limit.balance - order.balance,
  };
  const traded = {
    ...order,
    quantity: order.balance - limit.balance,
  };
  return [_limit, traded];
}
/** */
function convert({ quantity, price, balance, ...order }: Order): OrderInput {
  return {
    ...order,
    quantity: parseFloat(quantity),
    price: parseFloat(price),
    balance: parseFloat(balance),
  };
}
/** */
function convertBack({ quantity, price, balance, ...order }: OrderInput) {
  return {
    ...order,
    quantity: quantity.toString(),
    price: price.toString(),
    balance: balance.toString(),
  };
}
