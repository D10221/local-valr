import { Store } from "@reduxjs/toolkit";
import { RequestHandler } from "express";
/** */
export default function useStore<T>(store: Store<T>): RequestHandler {
  return (req, _res, next) => {
    req.store = store;
    next();
  };
}
