import { configureStore } from "@reduxjs/toolkit";
import assert from "assert";
import dotenv from "dotenv";
import express, { Request } from "express";
import fs from "fs";
import path from "path";
import {
  BTCZAR,
  CurrencyPair,
  Order,
  reducer as orderbook,
  Side,
} from "../orderbook";
import { toOrder } from "../orderbook/order-input";
import configure from "../server/configure";
import start from "../server/start";
import uid from "../util";
/** */
const store = configureStore({
  reducer: { orderbook },
  preloadedState: { orderbook: {} },
});
/** */
export function createRequest<Body = any, Params = any>({
  body,
  params,
}: {
  body?: Body;
  params?: Params;
}): Request {
  return { store, body, params } as any;
  /**
   * Hacky: satisfy Typescript,
   * Solution: fix Resolver type signature
   */
}
/** */
export async function startServer() {
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
}

const json = (x: any) => JSON.stringify(x, null, 2);

export function deepStrictEqual(expected: any, actual: any) {
  assert.deepStrictEqual(
    expected,
    actual,
    `Expected ${json(actual)} to be ${json(expected)}`
  );
}

export function strictEqual(expected: any, actual: any) {
  assert.strictEqual(expected, actual, `Expected ${actual} to be ${expected}`);
}

export function newOrder(
  side: Side,
  {
    balance,
    price,
    quantity,
    currencyPair,
  }: {
    balance?: number;
    price: number;
    quantity: number;
    currencyPair?: CurrencyPair;
  }
): Order {
  return toOrder({
    balance: balance ?? quantity,
    currencyPair: currencyPair ?? BTCZAR,
    id: uid(),
    price,
    quantity,
    side,
    createdAt: Date.now(),
  });
}
