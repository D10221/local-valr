import type { State } from "./state";
import { configureStore } from "@reduxjs/toolkit";
import { RequestHandler } from "express";
import orders from "./orders";
import tradeHistory from "./trade-history";

export const create = (preloadedState: State) =>
  configureStore({
    reducer: {
      orders: orders.reducer,
      tradeHistory: tradeHistory.reducer,
    },
    preloadedState,
  });

/** */
export function middleware(preloadedState: State): RequestHandler {
  const store = create(preloadedState);
  return (req, _res, next) => {
    req.store = store;
    next();
  };
}
