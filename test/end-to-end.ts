import assert from "assert";
import fetch from "node-fetch";
import express from "express";
import dotenv from "dotenv";
import path from "path";
import start from "../src/start";
import configure from "../src/configure";
import fs from "fs";
import { getHash } from "../src/auth";
import type { OrderBook } from "../src/types";

describe("end-to-end", () => {
  before(async () => {
    // ...
    dotenv.config({
      path: fs.existsSync(path.join(process.cwd(), ".env.local"))
        ? path.join(process.cwd(), ".env.local") // Not in source control
        : path.join(process.cwd(), ".env"),
    });
    const app = express();
    try {
      const server = await start(app);
      await configure(app);
      const { address, family, port } = server.address() as any;
      return `Express Listening on [${[address, family, port]}]`;
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  });

  after(() => {
    process.exit();
  });

  const port = process.env.PORT || "5000";

  it("posts limit", async () => {
    const r = await fetch(`http://localhost:${port}/api/orders/limit`, {
      method: "POST",
      body: JSON.stringify({
        side: "SELL",
        quantity: "1",
        price: "1",
        currencyPair: "BTCZAR",
        customerOrderId: "1234",
      }),
      headers: {
        "API-KEY": getHash(process.env.API_KEY),
        "Content-Type": "application/json",
      },
    });
    if (!r.ok) throw new Error(`${r.statusText} (${r.status})`);
    assert.strictEqual("done", await r.text());
  });

  it("orderbook", async () => {
    const {
      asks,
      bids,
    }: { asks: OrderBook[]; bids: OrderBook[] } = await fetch(
      `http://localhost:${port}/api/BTCZAR/orderbook`,
      {
        headers: {
          "API-KEY": getHash(process.env.API_KEY),
          "Content-Type": "application/json",
        },
      }
    ).then((x) => x.json());
    assert.strictEqual("BTCZAR", asks[0].currencyPair);
    assert.strictEqual(0, bids.length);
  });

  it("tradehistory", async () => {
    const x: OrderBook[] = await fetch(
      `http://localhost:${port}/api/BTCZAR/tradehistory`,
      {
        headers: {
          "API-KEY": getHash(process.env.API_KEY),
          "Content-Type": "application/json",
        },
      }
    ).then((x) => x.json());
    assert.strictEqual("BTCZAR", x[0].currencyPair);
    assert.strictEqual(1, x.length);
  });
});
