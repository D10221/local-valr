import { RequestHandler } from "express";
/** */
export default function requestLogger(): RequestHandler {
  return (req, _res, next) => {
    console.log("%s: '%s'", req.method, req.path);
    next();
  };
}
