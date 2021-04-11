import { filter, pipe } from "ramda";
import { toList } from "../../util";
import { CurrencyPair, Order, Side } from "../types";
import sortByPrice from "./sort-by-price";
/** */
export const orderedSide = (currencyPair: CurrencyPair, side: Side) =>
  pipe(
    toList<Order>(),
    filter((x: Order) => x.currencyPair === currencyPair),
    filter((x: Order) => x.side === side),
    sortByPrice
  );
