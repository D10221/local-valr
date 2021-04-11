import { Order } from "./types";

type OrderToString = <T extends Order>(
  t: T
) => Omit<T, "balance" | "price" | "quantity"> & {
  balance: string;
  price: string;
  quantity: string;
};

const orderToString = ({ balance, price, quantity, ...o }: any): any => {
  return {
    ...o,
    balance: numberToString(balance),
    price: numberToString(price),
    quantity: numberToString(quantity),
  };
};

function numberToString(n: number, fractionDigits = 16) {
  return n?.toFixed(fractionDigits);
}

function toString(x: any) {
  return !x
    ? undefined
    : typeof x === "number"
    ? numberToString(x)
    : orderToString(x);
}

export default toString as ((n: number, fractionDigits?: number) => string) &
  OrderToString;
