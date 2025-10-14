import { memoRepository } from "../repositories/memoRepositories";
import { MemoActionTypeConst } from "../db/schema";
import * as errorMessage from "../types/constant/errorMessage";
import { db } from "../db/db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export const memoService = {
  // Buat memo baru (maker)
  async createMemo(makerId: number, title: string, content: string){
    const memo = await memoRepository.createMemo({
      title,
      content,
      makerId,
      status: "DRAFT"
    });

    if(!memo){
      throw new Error(errorMessage.MEMO_NOT_FOUND);
    }

    await memoRepository.logAction(
      memo.id,
      makerId,
      MemoActionTypeConst.CREATE,
      "Memo dibuat oleh maker"
    );
    return memo;
  },

  // submit to checker
  // async submitToChecker(memoId: number, userId: number){
  //   const memo = await memoRepository.findByMemoId(memoId);
  //   if(!memo) throw new Error(errorMessage.MEMO_NOT_FOUND);
  //   if(memo.makerId !== userId) throw new Error(errorMessage.ONLY_MAKER_CAN_SUBMIT);
    
  //   await memoRepository.updateMemo(memoId, {
  //     status: "SUBMITTED_TO_CHECKER",
  //     currentHandlerId: memo.checkerId ?? null,
  //   });

  //   await memoRepository.logAction(
  //     memoId,
  //     userId,
  //     MemoActionTypeConst.SUBMIT,
  //     "Memo dikirim ke checker"
  //   );
  // },

  async submitMemo(memoId: number, userId: number){
    const memo = await memoRepository.findByMemoId(memoId);
    if(!memo){
      throw new Error (errorMessage.MEMO_NOT_FOUND);
    }

    // ambil data user pembuat untuk mengetahui rolenya
    const [maker] = await db.select().from(users).where(eq(users.id, memo.makerId));
    if(!maker){
      throw new Error("Data pembuat memo tidak ditemukan")
    }

    let newStatus: string;
    let logMsg: string;

    switch(maker.role){
      case "GURU":
        newStatus = "SUBMITTED_TO_CHECKER";
        logMsg = "Memo dikirim ke checker oleh Guru";
        break;
      case "WAKASEK":
        newStatus = "SUBMITTED_TO_APPROVER";
        logMsg = "Memo dikirim langsung ke approver oleh Wakasek";
        break;
      case "KEPSEK":
        newStatus = "APPROVED";
        logMsg = "Memo langsung disetujui dan dikirim ke penerima oleh Kepsek";
        break;

      default:
        throw new Error("Role pembuat tidak valid");
    }

    // update memo
    await memoRepository.updateMemo(memoId, {
      status: newStatus as any,
      currentHandlerId: null,
      submittedAt: new Date(),
    }),

    // Simpan log
    await memoRepository.logAction(
        memoId,
        userId,
        MemoActionTypeConst.SUBMIT,
        logMsg
      );
  },

  // Approve Memo
  async approveMemo(memoId: number, userId: number){
    const memo = await memoRepository.findByMemoId(memoId);
    if(!memo) {
      throw new Error(errorMessage.MEMO_NOT_FOUND);
    }
    await memoRepository.updateMemo(memoId, {
      status: "APPROVED",
      currentHandlerId: null,
    });

    await memoRepository.logAction(
      memoId,
      userId,
      MemoActionTypeConst.APPROVE,
      "Memo Disetujui Oleh Approver"
    );
  },

  // Revisi Memo
  async reviseMemo(memoId: number, userId: number, remarks: string){
    const memo = await memoRepository.findByMemoId(memoId);

    if(!memo){
      throw new Error(errorMessage.MEMO_NOT_FOUND);
    }

    const newStatus = 
      memo.status === "SUBMITTED_TO_CHECKER"
      ? "REVISED_BY_CHECKER"
      : "REVISED_BY_APPROVER";

      await memoRepository.updateMemo(memoId, { status: newStatus });
      await memoRepository.logAction(
        memoId,
        userId,
        MemoActionTypeConst.REVISE,
        remarks
      );
  },

  // Get semua memo
  async getAll(){
    return memoRepository.getAllMemos();
  },
}