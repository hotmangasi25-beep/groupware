import {
  pgTable,
  varchar,
  text,
  date,
  integer,
  timestamp,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";

//
// =======================================================
// ENUMS
// =======================================================
//

// 🔹 Enum untuk role user
export const userRoleEnum = pgEnum("user_role", ["GURU", "WAKASEK", "KEPSEK"]);
export type UserRole = typeof userRoleEnum.enumValues[number];

// 🔹 Enum untuk status memo
export const memoStatusEnum = pgEnum("memo_status", [
  "DRAFT",
  "SUBMITTED_TO_CHECKER",
  "SUBMITTED_TO_APPROVER",
  "CHECKED",
  "REJECTED_BY_CHECKER",
  "REJECTED_BY_APPROVER",
  "APPROVED",
  "RECEIVED",
  "ARCHIVED",
]);
export type MemoStatusType = typeof memoStatusEnum.enumValues[number];

// 🔹 Enum untuk action log (riwayat memo)
export const memoActionEnum = pgEnum("memo_action_type", [
  "CREATE",
  "SUBMIT",
  "CHECK",
  "APPROVE",
  "REJECT",
  "ARCHIVE",
  "UNARCHIVE",
]);
export type MemoActionType = typeof memoActionEnum.enumValues[number];

//
// =======================================================
// USERS TABLE
// =======================================================
//
export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
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
  role: userRoleEnum("role").notNull().default("GURU"),
});

//
// =======================================================
// MEMOS TABLE
// =======================================================
//
export const memos = pgTable("memos", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  makerId: integer("maker_id").notNull().references(() => users.id),
  checkerId: integer("checker_id").references(() => users.id),
  approverId: integer("approver_id").references(() => users.id),
  status: memoStatusEnum("status").default("DRAFT"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  submittedAt: timestamp("submitted_at"),
  approvedAt: timestamp("approved_at"),
});

//
// =======================================================
// MEMO RECIPIENTS TABLE
// =======================================================
//
export const memoRecipients = pgTable("memo_recipients", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  memoId: integer("memo_id").notNull().references(() => memos.id),
  recipientId: integer("recipient_id").notNull().references(() => users.id),
  isRead: boolean("is_read").default(false),
  archived: boolean("archived").default(false),
});

//
// =======================================================
// MEMO CC TABLE
// =======================================================
//
export const memoCC = pgTable("memo_cc", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  memoId: integer("memo_id").notNull().references(() => memos.id),
  ccUserId: integer("cc_user_id").notNull().references(() => users.id),
});

//
// =======================================================
// MEMO ATTACHMENTS TABLE
// =======================================================
//
export const memoAttachments = pgTable("memo_attachments", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  memoId: integer("memo_id").notNull().references(() => memos.id),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  filePath: text("file_path").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

//
// =======================================================
// MEMO ACTIONS TABLE (LOG HISTORY)
// =======================================================
//
export const memoActions = pgTable("memo_actions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  memoId: integer("memo_id").notNull().references(() => memos.id),
  actionBy: integer("action_by").notNull().references(() => users.id),
  actionType: memoActionEnum("action_type").notNull(),
  remarks: text("remarks"),
  createdAt: timestamp("created_at").defaultNow(),
});

//
// =======================================================
// TYPE INFERENCE UNTUK TIAP TABEL (Opsional tapi disarankan)
// =======================================================
//
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Memo = typeof memos.$inferSelect;
export type NewMemo = typeof memos.$inferInsert;

export type MemoRecipient = typeof memoRecipients.$inferSelect;
export type NewMemoRecipient = typeof memoRecipients.$inferInsert;

export type MemoCC = typeof memoCC.$inferSelect;
export type NewMemoCC = typeof memoCC.$inferInsert;

export type MemoAttachment = typeof memoAttachments.$inferSelect;
export type NewMemoAttachment = typeof memoAttachments.$inferInsert;

export type MemoAction = typeof memoActions.$inferSelect;
export type NewMemoAction = typeof memoActions.$inferInsert;
