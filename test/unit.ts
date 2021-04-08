import assert from "assert";
import { Request } from "express";
import resolvers from "../src/resolvers";
import state from "../src/state";
import { create as createStore } from "../src/store";
import { LimitRequest } from "../src/types";

/** */
const _store = createStore(state);
/** */
function createRequest<Body = any, Params = any>({
  body,
  params,
}: {
  body?: Body;
  params?: Params;
}): Request {
  return { store: _store, body, params } as any;
  /**
   * Hacky: satisfy Typescript,
   * Solution: fix Resolver type signature
   */
}
describe("limit", () => {
  it("works", async () => {
    const x = await resolvers.limit(
      createRequest<LimitRequest>({
        body: {
          side: "BUY",
          quantity: "1",
          price: "1",
          currencyPair: "BTCZAR",
          customerOrderId: "1234",
        },
      })
    );
    assert.strictEqual(x, "done");
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
    const actual = await resolvers.tradeHistory(
      createRequest({ params: { currencyPair: "BTCZAR" } })
    );
    assert.strictEqual(actual.length, 1);
    assert.strictEqual(actual[0].price, "1");
  });
});
