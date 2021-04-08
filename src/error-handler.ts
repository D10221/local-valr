import {
  NextFunction,
  Request,
  Response,
  ErrorRequestHandler,
} from "express-serve-static-core";
/** @description plain text error handler */
const errorHandler: ErrorRequestHandler = (
  error: Error & { code?: number },
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error("Request Error\n", error);
  res.statusMessage = error.message;
  const statusCode = error.code || 500;
  return res.status(statusCode).send(`${error.message} (${statusCode})`);
};
export default errorHandler;
