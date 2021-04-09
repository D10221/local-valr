import type { State } from "./state";
import { configureStore } from "@reduxjs/toolkit";
import { RequestHandler } from "express";
import orderbook from "./orderbook";
/** */
export const create = (preloadedState: State) =>
  configureStore({
    reducer: {
      orderbook: orderbook.reducer,
    },
    preloadedState,
  });
/** */
export function expressMiddleware(preloadedState: State): RequestHandler {
  const store = create(preloadedState);
  return (req, _res, next) => {
    req.store = store;
    next();
  };
}
