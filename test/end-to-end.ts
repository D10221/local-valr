import fetch from "node-fetch";
import { BTCZAR, OrderBookResponse, SELL } from "../orderbook";
import { getHash } from "../server/auth";
import { startServer, strictEqual } from "./util";
/** */
describe("end-to-end", () => {
  before(startServer);
  after(() => process.exit());

  const port = process.env.PORT || "5000";

  it("posts limit", async () => {
    const r = await fetch(`http://localhost:${port}/api/orders/limit`, {
      method: "POST",
      body: JSON.stringify({
        side: SELL,
        quantity: "1",
        price: "1",
        currencyPair: BTCZAR,
        customerOrderId: "1234",
      }),
      headers: {
        "API-KEY": getHash(process.env.API_KEY),
        "Content-Type": "application/json",
      },
    });
    if (!r.ok) throw new Error(`${r.statusText} (${r.status})`);
    const { id, requestid } = await r.json();
    strictEqual(typeof id, "string");
    strictEqual(typeof requestid, "string");
  });

  it("gets orderbook", async () => {
    const {
      asks,
      bids,
    }: { asks: OrderBookResponse[]; bids: OrderBookResponse[] } = await fetch(
      `http://localhost:${port}/api/BTCZAR/orderbook`,
      {
        headers: {
          "API-KEY": getHash(process.env.API_KEY),
          "Content-Type": "application/json",
        },
      }
    ).then((x) => x.json());
    strictEqual(BTCZAR, asks[0].currencyPair);
    strictEqual(0, bids.length);
  });

  it("gets tradehistory", async () => {
    const x: OrderBookResponse[] = await fetch(
      `http://localhost:${port}/api/BTCZAR/tradehistory`,
      {
        headers: {
          "API-KEY": getHash(process.env.API_KEY),
          "Content-Type": "application/json",
        },
      }
    ).then((x) => x.json());
    strictEqual(BTCZAR, x[0].currencyPair);
    strictEqual(1, x.length);
  });
});
