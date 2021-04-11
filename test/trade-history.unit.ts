import { BTCZAR, tradeHistory } from "../orderbook";
import { createRequest, strictEqual } from "./util";

describe("tradeHistory", () => {
  it("works", async () => {
    const x = await tradeHistory(
      createRequest({ params: { currencyPair: BTCZAR } })
    );
    strictEqual(BTCZAR, x[0].currencyPair);
  });
});
