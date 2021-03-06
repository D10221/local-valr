import { createHmac } from "crypto";
import type { RequestHandler } from "express";

export function getHash(x: string) {
  return createHmac("sha256", process.env.SECRET).update(x).digest("hex");
}

const isDev = process.env.NODE_ENV !== "production";
const isTest = process.env.NODE_ENV === "test";

export default function useAuth(): RequestHandler {
  if (!process.env.SECRET) {
    throw new Error("SECRET required!");
  }
  if (!process.env.API_KEY) {
    throw new Error("API_KEY required!");
  }

  if (!isTest) {
    if (isDev) {
      console.debug(
        "Run in 'production' to hide the api key hash\n\tAPI_KEY: %s",
        getHash(process.env.API_KEY)
      );
    } else {
      console.info("Run in 'development' to see the api key hash");
    }
  }

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
