import assert from "assert";
import { LimitRequest, resolvers } from "../orderbook";
import { createRequest } from "./util";
/** */
describe("limit", () => {
  it("works", async () => {
    const { id, requestid } = await resolvers.limit(
      createRequest<LimitRequest>({
        body: {
          side: "BUY",
          quantity: "1",
          price: "1",
          currencyPair: "BTCZAR",
          requestid: "1234",
        },
      })
    );
    assert.strictEqual(typeof id, "string");
    assert.strictEqual(typeof requestid, "string");
    // TODO: validate balance
  });
});
describe("orderbook", () => {
  it("works", async () => {
    const actual = await resolvers.orderbook(
      createRequest({ params: { currencyPair: "BTCZAR" } })
    );
    assert.strictEqual(actual.asks.length, 0);
    assert.strictEqual(actual.bids.length, 1);
    assert.strictEqual(actual.bids[0].currencyPair, "BTCZAR");
    assert.strictEqual(actual.bids[0].orderCount, 1);
  });
});
describe("tradeHistory", () => {
  it("works", async () => {
    const x = await resolvers.tradeHistory(
      createRequest({ params: { currencyPair: "BTCZAR" } })
    );
    assert.strictEqual("BTCZAR", x[0].currencyPair);
  });
});
