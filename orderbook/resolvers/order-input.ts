import { Order } from "../types";
/** */
export type OrderInput = Omit<Order, "quantity" | "price" | "balance"> & {
  quantity: number;
  price: number;
  balance: number;
};
/** */
export function convert({
  quantity,
  price,
  balance,
  ...order
}: Order): OrderInput {
  return {
    ...order,
    quantity: parseFloat(quantity),
    price: parseFloat(price),
    balance: parseFloat(balance),
  };
}
/** */
export function convertBack({
  quantity,
  price,
  balance,
  ...order
}: OrderInput): Order {
  return {
    ...order,
    quantity: quantity.toString(),
    price: price.toString(),
    balance: balance.toString(),
  };
}
