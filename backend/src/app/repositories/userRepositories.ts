import { db } from "../db/db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { UserRole } from "../db/schema";

// Ambil tipe dari schema 
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type AuthUser = {
  id: number; 
  nip: string;
  password: string;
};

// 🔹 Cari user berdasarkan NIP (khusus login)
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

// 🔹 Buat user baru
export const createUser = async (userData: NewUser): Promise<User> => {
  const result = await db.insert(users).values(userData).returning();

  if (!result[0]) {
    throw new Error("Failed to create user");
  }

  return result[0];
};

// 🔹 Update password
export const updatePassword = async (nip: string, newPassword: string) => {
  await db
    .update(users)
    .set({ password: newPassword })
    .where(eq(users.nip, nip));
};

// 🔹 Logout
export const logout = async (nip: string, token: string | null) => {
  await db
    .update(users)
    .set({ metaToken: token })
    .where(eq(users.nip, nip));
};



export const findByRole = async (role: UserRole): Promise<User | undefined> => {
  const result = await db.select().from(users).where(eq(users.role, role));
  return result[0];
};


// =======================================================
// 🔹 Tambahan untuk fitur MEMO
// =======================================================

// ✅ Cari user berdasarkan NIP, tapi lengkap (termasuk role)
export const findUserWithRoleByNIP = async (
  nip: string
): Promise<User | undefined> => {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.nip, nip));

  return result[0];
};

export const findById = async(id: number) => {
    const result = await db.select().from(users).where(eq(users.id, id));
    result[0];
};

 // 
 export const getUsers = async (limit: number, offset: number) => {
    return await db.select().from(users).limit(limit).offset(offset);
 };

 export const countUsers = async () => {
    const result = await db.select({ count: users.id }).from(users);
    return result.length;
 };
