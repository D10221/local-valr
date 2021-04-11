import { Order } from "./types";

/**  */
export function roundNumber(n: number, fractionDigits = 16) {
  return parseFloat(n.toFixed(fractionDigits));
}
/** */
export function roundOrder({ balance, price, quantity, ...o }: Order): Order {
  return {
    ...o,
    balance: roundNumber(balance),
    price: roundNumber(price),
    quantity: roundNumber(quantity),
  };
}
/** */
function round(x: number | Order) {
  return typeof x === "number" ? roundNumber(x) : roundOrder(x);
}
export default round as ((x: number) => number) & ((x: Order) => Order);
