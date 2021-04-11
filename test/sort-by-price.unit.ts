import { BTCZAR, BUY, select, SELL } from "../orderbook";
import { deepStrictEqual } from "./util";
/** */
describe("sortByPrice", () => {
  it("sorts BUY orders asc", () => {
    const asks = select
      .sortByPrice([
        {
          currencyPair: BTCZAR,
          id: "0",
          price: "1",
          quantity: "1",
          requestid: "1",
          side: BUY,
          balance: "",
          createdAt: 0,
        },
        {
          currencyPair: BTCZAR,
          id: "0",
          price: "2",
          quantity: "1",
          requestid: "1",
          side: BUY,
          balance: "",
          createdAt: 0,
        },
      ])
      .map((x) => x.price);
    deepStrictEqual(["1", "2"], asks);
  });
  it("sorts SELL orders desc.", () => {
    const bids = select
      .sortByPrice([
        {
          currencyPair: BTCZAR,
          id: "0",
          price: "1",
          quantity: "1",
          requestid: "1",
          side: SELL,
          balance: "",
          createdAt: 0,
        },
        {
          currencyPair: BTCZAR,
          id: "0",
          price: "2",
          quantity: "1",
          requestid: "1",
          side: SELL,
          balance: "",
          createdAt: 0,
        },
      ])
      .map((x) => x.price);
    deepStrictEqual(["2", "1"], bids);
  });
});
