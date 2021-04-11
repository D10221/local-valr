import express from "express";
import * as orderbook from "../orderbook";
import useStore from "./use-store";
import auth from "./auth";
import errorHandler from "./error-handler";
import requestLogger from "./request-logger";
import { configureStore } from "@reduxjs/toolkit";
/** */
export default async function configure(app: express.Application) {
  try {
    const store = configureStore({
      reducer: {
        orderbook: orderbook.reducer,
      },
      preloadedState: { orderbook: {} },
    });
    // TODO: app.use('helmet')
    // TODO: app.use('rate-limit')
    app.use(
      "/api",
      requestLogger(),
      auth(),
      express.json(),
      useStore(store),
      orderbook.api(),
      errorHandler
    );
    // TODO: app.use(error-handler);
    return app;
  } catch (error) {
    return Promise.reject(error);
  }
}
