import { createHmac } from "crypto";
import type { RequestHandler } from "express";

export function getHash(x: string) {
  return createHmac("sha256", process.env.SECRET).update(x).digest("hex");
}

export default function useAuth(): RequestHandler {
  if (!process.env.SECRET) {
    throw new Error("SECRET required!");
  }
  if (!process.env.API_KEY) {
    throw new Error("API_KEY required!");
  }

  console.log("API_KEY: %s", getHash(process.env.API_KEY));

  return (req, _res, next) => {
    try {
      var apiKey = req.headers["api-key"];
      if (typeof apiKey !== "string" || !apiKey) {
        throw new UnauthorizedError("Unauthorized");
      }
      if (apiKey !== getHash(process.env.API_KEY)) {
        throw new UnauthorizedError("Unauthorized");
      }
      next();
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        return next(error);
      }
      console.error(error);
      next(new Error("Auth Error"));
    }
  };
}

export class UnauthorizedError extends Error {
  code = 401;
}
