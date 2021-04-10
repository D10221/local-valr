import { Router } from "express";
import resolver from "./resolver";
import resolvers from "./resolvers";
/**
 * Allow to be mounted/partitioned '/api' |'/api/v1' ... etc
 */
export default function useApi() {
  var api = Router();
  api.get("/:currencyPair/orderbook", resolver.handleJson(resolvers.orderbook));
  api.get(
    "/:currencyPair/tradehistory",
    resolver.handleJson(resolvers.tradeHistory)
  );
  api.post("/orders/limit", resolver.handleJson(resolvers.limit));
  return api;
}
