import { sum } from "ramda";
import { BUY, round, SELL, trade } from "../orderbook";
import { deepStrictEqual, newOrder, strictEqual } from "./util";
/** */
describe("trade", () => {
  /**  */
  it("Limit Buy", () => {
    const orders = [
      newOrder(BUY, { id: "0", price: 0.25, quantity: 0.1 }),
      newOrder(SELL, { id: "1", price: 0.1, quantity: 0.03 }),
      newOrder(SELL, { id: "2", price: 0.2, quantity: 0.03 }),
      newOrder(SELL, { id: "3", price: 0.2, quantity: 0.03 }),
      newOrder(SELL, { id: "4", price: 0.3, quantity: 0.1 }),
      newOrder(SELL, { id: "5", price: 0.3, quantity: 0.1 }),
      newOrder(SELL, { id: "6", price: 0.3, quantity: 0.1 }),
      newOrder(SELL, { id: "7", price: 0.4, quantity: 0.1 }),
    ];
    const limit = orders[0];
    /** */
    const [tradedLimit, tradedOrders] = trade(orders, limit);
    const expectedOrderIds = [1, 2, 3].map((x) => x.toString());

    strictEqual(expectedOrderIds.length, tradedOrders.length);

    deepStrictEqual(
      expectedOrderIds,
      tradedOrders.map((x) => x.id)
    );

    const expectedBalance = round(
      limit.quantity -
        sum(
          tradedOrders
            .filter((x) => expectedOrderIds.indexOf(x.id) !== -1)
            .map((x) => x.quantity)
        )
    );
    deepStrictEqual({ ...limit, balance: expectedBalance }, tradedLimit);
  });
  it("Limit Sell", () => {
    const orders = [
      newOrder(SELL, { id: "0", price: 0.25, quantity: 0.1 }),
      newOrder(BUY, { id: "1", price: 0.1, quantity: 0.03 }),
      newOrder(BUY, { id: "2", price: 0.3, quantity: 0.1 }),
      newOrder(BUY, { id: "3", price: 0.2, quantity: 0.03 }),
      newOrder(BUY, { id: "4", price: 0.4, quantity: 0.1 }),
      newOrder(BUY, { id: "5", price: 0.2, quantity: 0.03 }),
      newOrder(BUY, { id: "6", price: 0.3, quantity: 0.1 }),
      newOrder(BUY, { id: "7", price: 0.3, quantity: 0.1 }),
    ];
    const limit = orders[0];
    /** */
    const [tradedLimit, tradedOrders] = trade(orders, limit);

    const expectedOrderIds = [3, 5, 1].map((x) => x.toString());
    strictEqual(expectedOrderIds.length, tradedOrders.length);

    deepStrictEqual(
      expectedOrderIds,
      tradedOrders.map((x) => x.id)
    );

    const expectedBalance = round(
      limit.quantity -
        sum(
          tradedOrders
            .filter((x) => expectedOrderIds.indexOf(x.id) !== -1)
            .map((x) => x.quantity)
        )
    );
    deepStrictEqual({ ...limit, balance: expectedBalance }, tradedLimit);
  });
});
