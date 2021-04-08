import type { State } from "./state";
import { configureStore } from "@reduxjs/toolkit";
import { RequestHandler } from "express";
import orders from "./orders";
import tradeHistory from "./trade-history";
/** */
export default function (preloadedState: State): RequestHandler {
  const store = configureStore({
    reducer: {
      orders: orders.reducer,
      tradeHistory: tradeHistory.reducer,
    },
    preloadedState,
  });
  return (req, _res, next) => {
    req.store = store;
    next();
  };
}
