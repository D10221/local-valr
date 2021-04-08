import { RequestHandler, Router } from "express";
import * as orders from "./orders";
import validate, { ValidationError } from "./validate";
import * as currencyPairs from "./currency-pairs";
import * as tradeHistory from "./trade-history";
import uid from "./uid";
/**
 * @description orderbook request handler
 */
export const orderbook: RequestHandler = (req, res, next) => {
  try {
    const { currencyPair } = req.params;
    const state = req.store.getState();
    const ret = orders.select.orderbook(currencyPair)(state);
    // read
    return res.json(ret);
  } catch (error) {
    next(error);
  }
};
/**
 * orders limit request handler
 */
export const ordersLimit: RequestHandler = (req, res, next) => {
  try {
    const _validate = validate(req.store);
    _validate.limitRequest(req.body);
    const id = uid();
    req.store.dispatch(orders.actions.limit([id, req.body]));
    req.store.dispatch(tradeHistory.actions.add(id));
    res.send("ok");
  } catch (error) {
    next(error);
  }
};
/**
 * trade history request handler
 */
export const tradehistory: RequestHandler = async (req, res, next) => {
  try {
    const { currencyPair } = req.params;
    if (!currencyPairs.isValid(currencyPair)) {
      throw new ValidationError("BAD 'currencyPair'");
    }
    const state = req.store.getState();
    return res.json(
      tradeHistory.select.tradehistory(
        state,
        currencyPair,
        orders.select.raw(state)
      )
    );
  } catch (error) {
    next(error);
  }
};
/**
 *
 */
export default function useApi() {
  var api = Router();
  api.get("/:currencyPair/orderbook", orderbook);
  api.get("/:currencyPair/tradehistory", tradehistory);
  api.post("/orders/limit", ordersLimit);
  return api;
}
