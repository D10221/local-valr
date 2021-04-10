import { BTCZAR, BUY, select, SELL } from "../orderbook";
import { deepStrictEqual } from "./util";
/** */
describe("sortByPrice", () => {
  it("works", () => {
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
        },
        {
          currencyPair: BTCZAR,
          id: "0",
          price: "2",
          quantity: "1",
          requestid: "1",
          side: BUY,
          balance: "",
        },
      ])
      .map((x) => x.price);
    deepStrictEqual(["1", "2"], asks);
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
        },
        {
          currencyPair: BTCZAR,
          id: "0",
          price: "2",
          quantity: "1",
          requestid: "1",
          side: SELL,
          balance: "",
        },
      ])
      .map((x) => x.price);
    deepStrictEqual(["2", "1"], bids);
  });
});
