import express from "express";
import { middleware as storeMiddleware } from "./store";
import api from "./api";
import state from "./state";
import auth from "./auth";
import errorHandler from "./error-handler";
import requestLogger from "./request-logger";
/** */
export default async function configure(app: express.Application) {
  try {
    // TODO: app.use('helmet')
    // TODO: app.use('rate-limit')
    app.use(
      "/api",
      requestLogger(),
      auth(),
      express.json(),
      storeMiddleware(state),
      api(),
      errorHandler
    );
    // TODO: app.use(error-handler);
    return app;
  } catch (error) {
    return Promise.reject(error);
  }
}
