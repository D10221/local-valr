import { BTCZAR, BUY, SELL } from "../orderbook";
import sortByPrice from "../orderbook/select/sort-by-price";
import { deepStrictEqual } from "./util";
/** */
describe("sortByPrice", () => {
  it("sorts BUY orders asc", () => {
    const asks = sortByPrice([
      {
        currencyPair: BTCZAR,
        id: "0",
        price: 1,
        quantity: 1,
        side: BUY,
        balance: 1,
        createdAt: 0,
      },
      {
        currencyPair: BTCZAR,
        id: "1",
        price: 2,
        quantity: 1,
        side: BUY,
        balance: 1,
        createdAt: 0,
      },
    ]).map((x) => x.price);
    deepStrictEqual([1, 2], asks);
  });
  it("sorts SELL orders desc.", () => {
    const bids = sortByPrice([
      {
        currencyPair: BTCZAR,
        id: "0",
        price: 1,
        quantity: 1,
        side: SELL,
        balance: 0,
        createdAt: 0,
      },
      {
        currencyPair: BTCZAR,
        id: "0",
        price: 2,
        quantity: 1,
        side: SELL,
        balance: 0,
        createdAt: 0,
      },
    ]).map((x) => x.price);
    deepStrictEqual([2, 1], bids);
  });
});
