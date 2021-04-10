import trade from "../orderbook/resolvers/trade";
import assert from "assert";
import { BTCZAR, BUY, Order, SELL } from "../orderbook";
import uid from "../util";
import { deepStrictEqual, newOrder, strictEqual } from "./util";
/** */
describe("trade", () => {
  /**  */
  it("doesn't trade with empty orderbook ", () => {
    const limit: Order = {
      balance: "1",
      currencyPair: BTCZAR,
      id: "0",
      price: "1",
      quantity: "1",
      side: SELL,
      requestid: uid(),
    };
    const [tradedLimit, tradedOrders] = trade(limit, []);
    deepStrictEqual(limit, tradedLimit);
    strictEqual(0, tradedOrders.length);
  });
  /** */
  it("Sells", () => {
    try {
      const orderbook: Order[] = [
        {
          balance: "1",
          currencyPair: BTCZAR,
          id: "1",
          price: "1",
          quantity: "1",
          side: SELL,
          requestid: uid(),
        },
      ];
      const limit = newOrder(BUY, { balance: 1, price: 1, quantity: 1 });
      const [tradedLimit, tradedOrders] = trade(limit, orderbook);
      deepStrictEqual(
        {
          ...limit,
          balance: "0",
        },
        tradedLimit
      );
      strictEqual(2, tradedOrders.length);
    } catch (error) {
      console.log(error.message);
      assert.fail(error.message);
    }
  });
  /** */
  it("Buys", () => {
    try {
      const orderbook: Order[] = [
        {
          balance: "1",
          currencyPair: BTCZAR,
          id: "1",
          price: "1",
          quantity: "1",
          side: SELL,
          requestid: uid(),
        },
      ];
      const limit = newOrder(SELL, { balance: 1, price: 1, quantity: 1 });
      const [tradedLimit, tradedOrders] = trade(limit, orderbook);
      deepStrictEqual(
        {
          ...limit,
          balance: "0",
        },
        tradedLimit
      );
      strictEqual(2, tradedOrders.length);
    } catch (error) {
      console.log(error.message);
      assert.fail(error.message);
    }
  });
});
