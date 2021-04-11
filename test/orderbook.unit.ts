import { BTCZAR, orderbook, limit, LimitRequest, BUY } from "../orderbook";
import { createRequest, strictEqual } from "./util";
/** */
describe("orderbook", () => {
  before(async () => {
    await limit(
      createRequest<LimitRequest>({
        body: {
          side: BUY,
          quantity: "1",
          price: "1",
          currencyPair: BTCZAR,
        },
      })
    );
  });
  it("works", async () => {
    const actual = await orderbook(
      createRequest({ params: { currencyPair: BTCZAR } })
    );
    strictEqual(actual.asks.length, 0);
    strictEqual(actual.bids.length, 1);
    const order = actual.bids[0];
    strictEqual(order.currencyPair, BTCZAR);
    strictEqual(order.orderCount, 1);
  });
});
