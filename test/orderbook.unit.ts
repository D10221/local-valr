import {
  BTCZAR,
  BUY,
  limit,
  LimitRequest,
  orderbook,
  tradeHistory,
} from "../orderbook";
import { createRequest, strictEqual } from "./util";
/** */
describe("limit", () => {
  it("works", async () => {
    const { id, requestid } = await limit(
      createRequest<LimitRequest>({
        body: {
          side: BUY,
          quantity: "1",
          price: "1",
          currencyPair: BTCZAR,
          requestid: "1234",
        },
      })
    );
    strictEqual(typeof id, "string");
    strictEqual(typeof requestid, "string");
    // TODO: validate balance
  });
});
describe("orderbook", () => {
  it("works", async () => {
    const actual = await orderbook(
      createRequest({ params: { currencyPair: BTCZAR } })
    );
    strictEqual(actual.asks.length, 0);
    strictEqual(actual.bids.length, 1);
    strictEqual(actual.bids[0].currencyPair, BTCZAR);
    strictEqual(actual.bids[0].orderCount, 1);
  });
});
describe("tradeHistory", () => {
  it("works", async () => {
    const x = await tradeHistory(
      createRequest({ params: { currencyPair: BTCZAR } })
    );
    strictEqual(BTCZAR, x[0].currencyPair);
  });
});
