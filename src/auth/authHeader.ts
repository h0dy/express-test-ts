import { Request } from "express";

export const getBearerToken = (req: Request) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) throw new Error("no auth header included in request");
  const authToken = authHeader.replace("Bearer", "").trim();
  if (!authToken) throw new Error("no auth header included in request");
  return authToken;
};
