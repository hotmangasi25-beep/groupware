import { db } from "../db/db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

// Ambil tipe dari schema 
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type AuthUser = {
  id: number;
  nip: string;
  password: string;
};

export const findByNIP = async (nip: string): Promise<AuthUser | undefined> => {
  const result = await db
    .select({
      id: users.id,
      nip: users.nip,
      password: users.password,
    })
    .from(users)
    .where(eq(users.nip, nip));

  return result[0];
};

// Buat user baru

export const createUser = async (userData: NewUser): Promise<User> => {
  const result = await db.insert(users).values(userData).returning();

  if (!result[0]) {
    throw new Error("Failed to create user");
  }

  return result[0];
};

export const updatePassword = async (nip: string, newPassword: string) => {
  await db
    .update(users)
    .set({ password: newPassword })
    .where(eq(users.nip, nip));
};

export const logout = async (nip: string, token: string | null) => {
  await db
    .update(users)
    .set({ metaToken: token })
    .where(eq(users.nip, nip));
}

