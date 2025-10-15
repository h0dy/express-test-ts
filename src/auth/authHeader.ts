import { Request } from "express";
import { UserNotAuthenticatedErr } from "../api/errors.js";

export const getBearerToken = (req: Request) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    throw new UserNotAuthenticatedErr("no auth header included in request");
  }
  const authToken = authHeader.replace("Bearer", "").trim();
  if (!authToken) {
    throw new UserNotAuthenticatedErr("no auth header included in request");
  }
  return authToken;
};
