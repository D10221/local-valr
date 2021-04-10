import type { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import type { RequestHandler } from "express";
/** */
export type Resolver<
  Params extends ParamsDictionary = ParamsDictionary,
  Context extends Request = Request<Params>,
  Result = any
> = (context: Context) => Promise<Result>;
/** typescript helper */
export function createResolver<
  Params extends ParamsDictionary = ParamsDictionary,
  Context extends Request = Request,
  Result = any
>(r: Resolver<Params, Context, Result>): Resolver<Params, Context, Result> {
  return r;
}
/** simple JSON request handler */
export function handleJson<
  Params extends ParamsDictionary = ParamsDictionary,
  Context extends Request = Request,
  Result = any
>(r: Resolver<Params, Context, Result>): RequestHandler {
  return async (req: Context, res, next) => {
    try {
      res.json(await r(req));
    } catch (error) {
      next(error);
    }
  };
}
/** */
export default {
  createResolver,
  handleJson,
};
