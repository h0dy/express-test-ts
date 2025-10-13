import type { Request, Response } from "express";

export const handlerReadiness = async (
  _: Request,
  res: Response
): Promise<void> => {
  res.set({
    "Content-Type": "text/plain",
    charset: "utf-8",
  });
  res.status(200).send("OK");
};
