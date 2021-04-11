import { BUY, round } from "../orderbook";
import { newOrder, strictEqual } from "./util";
/** */
describe("round", () => {
  it("rounds number", () => {
    const x = 0.1 - 0.01;
    const n = round(x);
    strictEqual(0.09000000000000001, x);
    strictEqual(0.09, n);
  });
  it("rounds order", () => {
    const { price, quantity, balance } = round(
      newOrder(BUY, {
        price: 0.09000000000000001,
        quantity: 0.09000000000000001,
        balance: 0.09000000000000001,
      })
    );
    strictEqual(0.09, price);
    strictEqual(0.09, quantity);
    strictEqual(0.09, balance);
  });
});
