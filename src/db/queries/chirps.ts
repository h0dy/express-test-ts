import { asc, eq } from "drizzle-orm";
import { db } from "../index.js";
import { NewChirp, chirps } from "../schema.js";

export const createChirp = async (chirp: NewChirp) => {
  const [result] = await db.insert(chirps).values(chirp).returning();
  return result;
};

export const getAllChirps = async (): Promise<NewChirp[]> => {
  const result = await db.select().from(chirps).orderBy(asc(chirps.createdAt));
  return result;
};

export const getChirp = async (chirpId: string) => {
  const [result] = await db.select().from(chirps).where(eq(chirps.id, chirpId));
  return result;
};
