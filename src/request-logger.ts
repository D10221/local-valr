import { RequestHandler } from "express";
const isTest = process.env.NODE_ENV === "test";
/** */
export default function requestLogger(): RequestHandler {
  return (req, _res, next) => {
    if (!isTest) {
      console.log("%s: '%s'", req.method, req.path);
    }
    next();
  };
}
