import { Request, Response, NextFunction } from "express";
import { config } from "../config.js";
import {
  BadRequestErr,
  NotFoundErr,
  UserForbiddenErr,
  UserNotAuthenticatedErr,
} from "./errors.js";

export const middlewareLogResponses = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.on("finish", () => {
    if (res.statusCode < 200 || res.statusCode > 299) {
      console.log(
        `[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`
      );
    }
  });
  next();
};

export const middlewareMetricsInc = (
  _: Request,
  __: Response,
  next: NextFunction
) => {
  config.api.fileServerHits++;
  next();
};

export const errorMiddleware = (
  err: Error,
  _: Request,
  res: Response,
  __: NextFunction
) => {
  let statusCode = 500;
  let message = "Something went wrong on our end";

  if (err instanceof BadRequestErr) {
    statusCode = 400;
    message = err.message;
  } else if (err instanceof UserNotAuthenticatedErr) {
    statusCode = 401;
    message = err.message;
  } else if (err instanceof UserForbiddenErr) {
    statusCode = 403;
    message = err.message;
  } else if (err instanceof NotFoundErr) {
    statusCode = 404;
    message = err.message;
  }

  if (statusCode >= 500) {
    console.log(err.message);
  }

  res.status(statusCode).json({
    error: message,
  });
};
