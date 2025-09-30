import { pgTable, varchar, text, date, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(), // 🔥 pakai identity, bukan serial
  nip: varchar("nip", { length: 20 }).notNull().unique(),
  metaToken: varchar("meta_token", { length: 255 }),
  email: varchar("email", { length: 100 }),
  fullName: varchar("full_name", { length: 100 }),
  phoneNumber: varchar("phone_number", { length: 20 }),
  bornDate: date("born_date"),
  gender: varchar("gender", { length: 10 }),
  avatarUrl: text("avatar_url"),
  signatureUrl: text("signature_url"),
  password: text("password").notNull(),
});
