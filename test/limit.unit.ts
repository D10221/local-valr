import { BTCZAR, BUY, limit, LimitRequest } from "../orderbook";
import { createRequest, strictEqual } from "./util";

/** */
describe("limit", () => {
  it("works", async () => {
    const { id, balance, traded } = await limit(
      createRequest<LimitRequest>({
        body: {
          side: BUY,
          quantity: "1",
          price: "1",
          currencyPair: BTCZAR,
        },
      })
    );
    strictEqual(typeof id, "string");
    strictEqual("1", balance);
    strictEqual(false, traded);
    // TODO: validate balance
  });
});
