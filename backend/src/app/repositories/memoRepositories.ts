import { db } from "../db/db";
import {
  memos,
  memoActions,
  memoRecipients,
  Memo,
  NewMemo,
  MemoActionType,
} from "../db/schema";

import { eq } from "drizzle-orm";

export const memoRepository = {
  // create new memo
  async createMemo(data: NewMemo): Promise<Memo | undefined> {
    const [inserted] = await db.insert(memos).values(data).returning();
    return inserted;
  },
  // find by memo ID
  async findByMemoId(id: number): Promise<Memo | undefined> {
    const [result] = await db.select().from(memos).where(eq(memos.id, id));
    return result;
  },

  // update memo
  async updateMemo(id: number, data: Partial<Memo>): Promise<void> {
    await db.update(memos).set(data).where(eq(memos.id, id));
  },

  // insert action log
  async logAction(
    memoId: number,
    userId: number,
    actionType: MemoActionType,
    remarks?: string
  ) {
    await db.insert(memoActions).values({
        memoId,
        actionBy: userId,
        actionType,
        remarks
    });
  },

  // add recipients
  async addRecipients(memoId: number, recipientsIds: number[]){
    if(!recipientsIds.length) return;
    await db.insert(memoRecipients).values(
      recipientsIds.map((r) => ({ memoId, recipientId: r }))
    );
  },

  // list all memos (for testing)
  async getAllMemos(): Promise<Memo[]>{
    return db.select().from(memos);
  }
}