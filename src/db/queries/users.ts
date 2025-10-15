import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { NewUser, users } from "../schema.js";

export const createUser = async (user: NewUser) => {
  const [result] = await db.insert(users).values(user).returning();
  return result;
};

export const deleteAllUsers = async () => {
  await db.delete(users);
  console.log("Users table reset successfully");
};

export const getUserByEmail = async (email: string) => {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user;
};

export const updateUser = async (
  email: string,
  hashedPassword: string,
  userId: string
) => {
  const [updatedUser] = await db
    .update(users)
    .set({ email, hashedPassword })
    .where(eq(users.id, userId))
    .returning();
  return updatedUser;
};
