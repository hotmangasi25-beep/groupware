import { db } from "../db/db";
import { memos, memoRecipients, memoCC, memoActions } from "../db/schema";

// =======================================================
// 🔹 CREATE MEMO
// =======================================================
export const createMemo = async (data: any) => {
  const result = await db.insert(memos).values(data).returning();
  const newMemo = result[0];

  // ✅ Tambahkan guard biar tidak mungkin undefined
  if (!newMemo) {
    throw new Error("Failed to create memo");
  }

  return newMemo;
};

// =======================================================
// 🔹 ADD RECIPIENTS
// =======================================================
export const addRecipients = async (memoId: number, recipients: number[]) => {
  if (!recipients || recipients.length === 0) return;

  for (const recipientId of recipients) {
    await db.insert(memoRecipients).values({
      memoId,
      recipientId,
    });
  }
};

// =======================================================
// 🔹 ADD CC
// =======================================================
export const addCC = async (memoId: number, ccUserIds: number[]) => {
  if (!ccUserIds || ccUserIds.length === 0) return;

  for (const ccUserId of ccUserIds) {
    await db.insert(memoCC).values({
      memoId,
      ccUserId,
    });
  }
};

// =======================================================
// 🔹 LOG ACTION (HISTORY)
// =======================================================
export const logAction = async (data: {
  memoId: number;
  actionBy: number;
  actionType: string;
  remarks?: string;
}) => {
  await db.insert(memoActions).values(data);
};
