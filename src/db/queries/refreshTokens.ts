import { and, eq, gt, isNull } from "drizzle-orm";
import { db } from "../index.js";
import { refreshTokens, users } from "../schema.js";
import { config } from "../../config.js";

export const createRefreshToken = async (userId: string, token: string) => {
  const [result] = await db
    .insert(refreshTokens)
    .values({
      expiresAt: new Date(Date.now() + config.jwt.refreshDuration),
      userId,
      token,
      revokedAt: null,
    })
    .returning();
  return result;
};

export const getRefreshToken = async (token: string) => {
  const [result] = await db
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.token, token));
  return result;
};

export const userForRefreshToken = async (token: string) => {
  const [result] = await db
    .select({ user: users })
    .from(users)
    .innerJoin(refreshTokens, eq(users.id, refreshTokens.userId))
    .where(
      and(
        eq(refreshTokens.token, token),
        isNull(refreshTokens.revokedAt),
        gt(refreshTokens.expiresAt, new Date())
      )
    )
    .limit(1);

  return result;
};

export const revokeRefreshToken = async (token: string) => {
  const result = await db
    .update(refreshTokens)
    .set({ expiresAt: new Date() })
    .where(eq(refreshTokens.token, token))
    .returning();
  if (result.length === 0) {
    throw new Error("Couldn't revoke token");
  }
};
