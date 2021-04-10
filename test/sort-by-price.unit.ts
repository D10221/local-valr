import assert from "assert";
import { sortByPrice } from "../orderbook/select";
/** */
describe("sortByPrice", () => {
  it("works", () => {
    const asks = sortByPrice([
      {
        currencyPair: "BTCZAR",
        id: "0",
        price: "1",
        quantity: "1",
        requestid: "1",
        side: "BUY",
        balance: "",
      },
      {
        currencyPair: "BTCZAR",
        id: "0",
        price: "2",
        quantity: "1",
        requestid: "1",
        side: "BUY",
        balance: "",
      },
    ]).map((x) => x.price);
    assert.deepStrictEqual(["1", "2"], asks);
    const bids = sortByPrice([
      {
        currencyPair: "BTCZAR",
        id: "0",
        price: "1",
        quantity: "1",
        requestid: "1",
        side: "SELL",
        balance: "",
      },
      {
        currencyPair: "BTCZAR",
        id: "0",
        price: "2",
        quantity: "1",
        requestid: "1",
        side: "SELL",
        balance: "",
      },
    ]).map((x) => x.price);
    assert.deepStrictEqual(["2", "1"], bids);
  });
});
