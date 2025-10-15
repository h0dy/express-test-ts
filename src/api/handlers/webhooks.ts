import { Request, Response } from "express";
import { upgradeUserToChirpyRed } from "../../db/queries/users.js";
import { NotFoundErr, UserNotAuthenticatedErr } from "../errors.js";
import { getAPIKey } from "../../auth/authHeader.js";
import { config } from "../../config.js";

export const handlerPolkaWebhook = async (req: Request, res: Response) => {
  type reqPolka = {
    event: string;
    data: {
      userId: string;
    };
  };
  const apiKey = getAPIKey(req);
  if (apiKey !== config.api.polkaKey) {
    throw new UserNotAuthenticatedErr("Invalid API key");
  }

  const reqBody: reqPolka = req.body;
  if (reqBody.event !== "user.upgraded") {
    res.status(204).send();
    return;
  }

  const user = await upgradeUserToChirpyRed(reqBody.data.userId);
  if (!user) {
    throw new NotFoundErr("user doesn't exist");
  }
  res.status(204).json({});
};
