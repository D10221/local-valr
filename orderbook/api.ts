import { Router } from "express";
import resolver from "../resolver";
import resolvers from "./resolvers";
/**
 * Allow to be mounted/partitioned '/api' |'/api/v1' ... etc
 */
export default function useApi() {
  const orderbook = resolver.handleJson(resolvers.orderbook);
  const tradeHistory = resolver.handleJson(resolvers.tradeHistory);
  const limit = resolver.handleJson(resolvers.limit);
  // ...
  const api = Router();
  api.get("/:currencyPair/orderbook", orderbook);
  api.get("/:currencyPair/tradehistory", tradeHistory);
  api.post("/orders/limit", limit);
  return api;
}
