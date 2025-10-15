import { Request, Response } from "express";
import { config } from "../../config.js";
import { deleteAllUsers } from "../../db/queries/users.js";
import { UserForbiddenErr } from "./../errors.js";

export const handlerResetMetric = async (_: Request, res: Response) => {
  config.api.fileServerHits = 0;
  if (config.api.platform != "dev") {
    throw new UserForbiddenErr("Reset is only allowed in dev environment");
  }
  await deleteAllUsers();
  res.status(200).send("Successfully reset");
};
