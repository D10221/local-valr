import { Order } from "./types";
/** */
export type OrderInput = Omit<Order, "quantity" | "price" | "balance"> & {
  quantity: number;
  price: number;
  balance: number;
};
/**
 * to Order with number values
 */
export function toOrderInput({
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
/**
 * to Order with String values
 */
export function toOrder({
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
