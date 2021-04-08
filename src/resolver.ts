import type { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import type { RequestHandler } from "express";
/** */
export type Resolver<
  Params extends ParamsDictionary = ParamsDictionary,
  Context extends Request = Request<Params>,
  Result = any
> = (context: Context) => Promise<Result>;
/** */
export default {
  /** typescript helper */
  create: function resolver<
    Params extends ParamsDictionary = ParamsDictionary,
    Context extends Request = Request,
    Result = any
  >(r: Resolver<Params, Context, Result>): Resolver<Params, Context, Result> {
    return r;
  },
  handleJson: jsonHandler,
  handleAny: anyHandler,
};
/** simple JSON request handler */
function jsonHandler<
  Params extends ParamsDictionary = ParamsDictionary,
  Context extends Request = Request,
  Result = any
>(r: Resolver<Params, Context, Result>): RequestHandler {
  return async (req: Context, res, next) => {
    try {
      const ret = await r(req);
      res.json(ret);
    } catch (error) {
      next(error);
    }
  };
}
/** simple request handler */
function anyHandler<
  Params extends ParamsDictionary = ParamsDictionary,
  Context extends Request = Request,
  Result = any
>(r: Resolver<Params, Context, Result>): RequestHandler {
  return async (req: Context, res, next) => {
    try {
      const ret = await r(req);
      res.send(ret);
    } catch (error) {
      next(error);
    }
  };
}
