import { BUY, Order, SELL } from "../orderbook";
import trade from "../orderbook/resolvers/trade";
import { deepStrictEqual, newOrder, strictEqual } from "./util";
/** */
describe("trade", () => {
  /**  */
  it("Limit Buy", () => {
    const limit: Order = newOrder(BUY, { price: 0.25, quantity: 0.1 });
    const orders = [
      newOrder(SELL, { price: 0.1, quantity: 0.03 }),
      newOrder(SELL, { price: 0.2, quantity: 0.03 }),
      newOrder(SELL, { price: 0.2, quantity: 0.03 }),
      newOrder(SELL, { price: 0.3, quantity: 0.1 }),
      newOrder(SELL, { price: 0.3, quantity: 0.1 }),
      newOrder(SELL, { price: 0.3, quantity: 0.1 }),
      newOrder(SELL, { price: 0.4, quantity: 0.1 }),
    ];
    /** */
    const [tradedLimit, tradedOrders] = trade(orders, limit);
    deepStrictEqual(
      {
        ...limit,
        balance: "0.1",
      },
      tradedLimit
    );
    strictEqual(3, tradedOrders.length);
  });
  it("Limit Sell", () => {
    const limit: Order = newOrder(SELL, { price: 0.25, quantity: 0.1 });
    const orders = [
      newOrder(BUY, { price: 0.1, quantity: 0.03 }),
      newOrder(BUY, { price: 0.3, quantity: 0.1 }),
      newOrder(BUY, { price: 0.2, quantity: 0.03 }),
      newOrder(BUY, { price: 0.4, quantity: 0.1 }),
      newOrder(BUY, { price: 0.2, quantity: 0.03 }),
      newOrder(BUY, { price: 0.3, quantity: 0.1 }),
      newOrder(BUY, { price: 0.3, quantity: 0.1 }),
    ];
    /** */
    /** */
    const [tradedLimit, tradedOrders] = trade(orders, limit);
    deepStrictEqual(
      {
        ...limit,
        balance: "0.1",
      },
      tradedLimit
    );
    strictEqual(3, tradedOrders.length);
  });
});
