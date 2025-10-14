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
  "REVISED_BY_CHECKER",
  "SUBMITTED_TO_APPROVER",
  "REVISED_BY_APPROVER",
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
  "REVISE", // tambahan untuk revisi memo antar level
]);
// export type MemoActionType = typeof memoActionEnum.enumValues[number];

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
// GROUPS TABLE (untuk penerima grup, misal: semua guru)
// =======================================================
//
export const groups = pgTable("groups", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const groupMembers = pgTable("group_members", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  groupId: integer("group_id").notNull().references(() => groups.id),
  userId: integer("user_id").notNull().references(() => users.id),
});

//
// =======================================================
// MEMOS TABLE (self-reference via function factory)
// =======================================================
//

export const createMemosTable = () =>
  pgTable("memos", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    title: varchar("title", { length: 255 }).notNull(),
    content: text("content").notNull(),

    // relasi user terkait
    makerId: integer("maker_id").notNull().references(() => users.id),
    checkerId: integer("checker_id").references(() => users.id),
    approverId: integer("approver_id").references(() => users.id),

    // status & workflow
    status: memoStatusEnum("status").default("DRAFT"),
    currentHandlerId: integer("current_handler_id").references(() => users.id),

    // metadata
    memoNumber: varchar("memo_number", { length: 50 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    submittedAt: timestamp("submitted_at"),
    approvedAt: timestamp("approved_at"),

    // parent memo reference (diisi setelah deklarasi)
    parentMemoId: integer("parent_memo_id"),
  });

// buat instance tabel
export const memos = createMemosTable();

// setelah memos terdefinisi, kita update relasi parentMemoId agar punya reference valid
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error - TypeScript tidak mengenali late binding tetapi ini aman di runtime
memos.parentMemoId = integer("parent_memo_id").references(() => memos.id);

//
// =======================================================
// MEMO RECIPIENTS TABLE
// =======================================================
//
export const memoRecipients = pgTable("memo_recipients", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  memoId: integer("memo_id").notNull().references(() => memos.id),
  recipientId: integer("recipient_id").notNull().references(() => users.id),
  groupId: integer("group_id").references(() => groups.id), // penerima grup

  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
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
  uploadedBy: integer("uploaded_by").references(() => users.id),
  isDeleted: boolean("is_deleted").default(false),
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

  // tracking perubahan status
  previousStatus: memoStatusEnum("previous_status"),
  newStatus: memoStatusEnum("new_status"),
});

//
// =======================================================
// MEMO COMMENTS TABLE (catatan revisi antar level)
// =======================================================
//
export const memoComments = pgTable("memo_comments", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  memoId: integer("memo_id").notNull().references(() => memos.id),
  commentedBy: integer("commented_by").notNull().references(() => users.id),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});


// =======================================================
// ENUM CONSTANTS (untuk type-safe action type di service layer)
// =======================================================
export const MemoActionTypeConst = {
  CREATE: "CREATE",
  SUBMIT: "SUBMIT",
  CHECK: "CHECK",
  APPROVE: "APPROVE",
  REJECT: "REJECT",
  ARCHIVE: "ARCHIVE",
  UNARCHIVE: "UNARCHIVE",
  REVISE: "REVISE",
} as const;

export type MemoActionType =
  (typeof MemoActionTypeConst)[keyof typeof MemoActionTypeConst];

//
// =======================================================
// TYPE INFERENCE UNTUK TIAP TABEL
// =======================================================
//
// User
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// Group
export type Group = typeof groups.$inferSelect;
export type NewGroup = typeof groups.$inferInsert;

export type GroupMember = typeof groupMembers.$inferSelect;
export type NewGroupMember = typeof groupMembers.$inferInsert;

// Memo
export type Memo = typeof memos.$inferSelect;
export type NewMemo = typeof memos.$inferInsert;

// Recipients
export type MemoRecipient = typeof memoRecipients.$inferSelect;
export type NewMemoRecipient = typeof memoRecipients.$inferInsert;

// CC
export type MemoCC = typeof memoCC.$inferSelect;
export type NewMemoCC = typeof memoCC.$inferInsert;

// Attachments
export type MemoAttachment = typeof memoAttachments.$inferSelect;
export type NewMemoAttachment = typeof memoAttachments.$inferInsert;

// Actions (Log)
export type MemoAction = typeof memoActions.$inferSelect;
export type NewMemoAction = typeof memoActions.$inferInsert;

// Comments
export type MemoComment = typeof memoComments.$inferSelect;
export type NewMemoComment = typeof memoComments.$inferInsert;

