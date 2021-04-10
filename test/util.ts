import { configureStore } from "@reduxjs/toolkit";
import dotenv from "dotenv";
import express, { Request } from "express";
import fs from "fs";
import path from "path";
import configure from "../server/configure";
import start from "../server/start";
import { reducer as orderbook } from "../orderbook";
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
