import { Request, Response } from "express";
import {
  createUser,
  getUserByEmail,
  updateUser,
} from "../../db/queries/users.js";
import { BadRequestErr, UserNotAuthenticatedErr } from "../errors.js";
import { checkPasswordHash, hashPassword } from "../../auth/password.js";
import { NewUser } from "../../db/schema.js";
import { makeJWT, makeRefreshToken, validateJWT } from "../../auth/jwt.js";
import { config } from "../../config.js";
import { createRefreshToken } from "../../db/queries/refreshTokens.js";
import { getBearerToken } from "../../auth/authHeader.js";

type UserRequestBody = {
  email: string;
  password: string;
};

type UserResponse = Omit<NewUser, "hashedPassword">;

export const handlerCreateUser = async (req: Request, res: Response) => {
  let { password, email }: UserRequestBody = req.body;
  if (!email || !password) {
    throw new BadRequestErr("Missing required fields");
  }
  const userHashedPassword = await hashPassword(password);
  const newUser = await createUser({
    email,
    hashedPassword: userHashedPassword,
  } satisfies NewUser);

  if (!newUser) throw new Error("couldn't create user");

  res.status(201).json({
    id: newUser.id,
    email: newUser.email,
    createdAt: newUser.createdAt,
    updatedAt: newUser.updatedAt,
  } satisfies UserResponse);
};

export const handlerLoginUser = async (req: Request, res: Response) => {
  let { password, email }: UserRequestBody = req.body;

  if (!email || !password) {
    throw new BadRequestErr("Missing required fields");
  }

  const user = await getUserByEmail(email);
  if (!user) throw new BadRequestErr("user doesn't exist");
  if (!(await checkPasswordHash(password, user.hashedPassword))) {
    throw new UserNotAuthenticatedErr("incorrect credential");
  }

  const accessToken = makeJWT(
    user.id,
    config.jwt.accessDuration,
    config.jwt.secret
  );
  const refreshToken = makeRefreshToken();
  const refreshTokenRecord = await createRefreshToken(user.id, refreshToken);

  res.status(200).json({
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    token: accessToken,
    refreshToken: refreshTokenRecord.token,
  } satisfies UserResponse & { token: string; refreshToken: string });
  return;
};

export const handlerUpdateUser = async (req: Request, res: Response) => {
  const { email, password }: UserRequestBody = req.body;
  const accessToken = getBearerToken(req);
  const userId = validateJWT(accessToken, config.jwt.secret);

  const hashedPassword = await hashPassword(password);
  const updatedUser = await updateUser(email, hashedPassword, userId);
  if (!updatedUser) throw new UserNotAuthenticatedErr("incorrect credential");

  res.status(200).json({
    id: updatedUser.id,
    email: updatedUser.email,
    createdAt: updatedUser.createdAt,
    updatedAt: updatedUser.updatedAt,
  } satisfies UserResponse);
};
