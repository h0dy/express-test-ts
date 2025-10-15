import jwt from "jsonwebtoken";
import { UserNotAuthenticatedErr } from "../api/errors.js";
import { randomBytes } from "crypto";

type payload = Pick<jwt.JwtPayload, "iss" | "sub" | "iat" | "exp">;
const TOKEN_ISSUER = "chirpy";

export const makeJWT = (userID: string, expiresIn: number, secret: string) => {
  const token = jwt.sign(
    {
      iss: TOKEN_ISSUER,
      sub: userID,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + expiresIn,
    } satisfies payload,
    secret,
    { algorithm: "HS256" }
  );
  return token;
};

export const validateJWT = (token: string, secret: string) => {
  let decoded: payload;
  try {
    decoded = jwt.verify(token, secret) as jwt.JwtPayload;
  } catch (e) {
    throw new UserNotAuthenticatedErr("Invalid token");
  }

  if (decoded.iss !== TOKEN_ISSUER) {
    throw new UserNotAuthenticatedErr("Invalid issuer");
  }

  if (!decoded.sub) {
    throw new UserNotAuthenticatedErr("No user ID in token");
  }

  return decoded.sub;
};

export const makeRefreshToken = () => {
  const randomHex = randomBytes(32).toString("hex");
  return randomHex;
};
