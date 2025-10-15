import { Request, Response } from "express";
import { getBearerToken } from "../../auth/authHeader.js";
import {
  revokeRefreshToken,
  userForRefreshToken,
} from "../../db/queries/refreshTokens.js";
import { UserNotAuthenticatedErr } from ".././errors.js";
import { makeJWT } from "../../auth/jwt.js";
import { config } from "../../config.js";

export const handlerRefreshToken = async (req: Request, res: Response) => {
  const token = getBearerToken(req);
  const result = await userForRefreshToken(token);

  if (!result) {
    throw new UserNotAuthenticatedErr("Unauthorized token");
  }
  const accessToken = makeJWT(
    result.user.id,
    config.jwt.accessDuration,
    config.jwt.secret
  );
  res.status(200).json({
    token: accessToken,
  });
};

export const handlerRevokeToken = async (req: Request, res: Response) => {
  const refreshToken = getBearerToken(req);
  await revokeRefreshToken(refreshToken);
  res.status(204).send();
};
