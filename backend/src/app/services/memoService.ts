import * as userRepository from "../repositories/userRepositories";
import * as memoRepository from "../repositories/memoRepositories";
import * as errorMessage from "../types/constant/errorMessage";

export const createMemo = async (memoData: {
  makerId: number;
  title: string;
  content: string;
  recipients: number[];
  cc?: number[];
}) => {
  // 🔹 Validasi user (ambil user lengkap, termasuk role)
  const maker = await userRepository.findUserWithRoleByNIP(String(memoData.makerId));
  if (!maker) {
    throw new Error(errorMessage.USER_NOT_FOUND);
  }

  // 🔹 Tentukan alur berdasarkan role
  let checkerId: number | null = null;
  let approverId: number | null = null;
  let status = "DRAFT";

  if (maker.role === "GURU") {
    const wakasek = await userRepository.findByRole("WAKASEK");
    const kepsek = await userRepository.findByRole("KEPSEK");

    if (!wakasek || !kepsek) {
      throw new Error(errorMessage.MAKER_AND_CHECKER_NOT_FOUND);
    }

    checkerId = wakasek.id;
    approverId = kepsek.id;
    status = "SUBMITTED_TO_CHECKER";
  } else if (maker.role === "WAKASEK") {
    const kepsek = await userRepository.findByRole("KEPSEK");
    if (!kepsek) {
      throw new Error(errorMessage.APPROVER_NOT_FOUND);
    }

    approverId = kepsek.id;
    status = "SUBMITTED_TO_APPROVER";
  } else if (maker.role === "KEPSEK") {
    status = "APPROVED";
  }

  // 🔹 Simpan memo utama
  const newMemo = await memoRepository.createMemo({
    title: memoData.title,
    content: memoData.content,
    makerId: maker.id,
    checkerId,
    approverId,
    status,
  });

  // 🔹 Tambahkan recipients
  await memoRepository.addRecipients(newMemo.id, memoData.recipients);

  // 🔹 Tambahkan CC (opsional)
  if (memoData.cc && memoData.cc.length > 0) {
    await memoRepository.addCC(newMemo.id, memoData.cc);
  }

  // 🔹 Catat log aksi
  await memoRepository.logAction({
    memoId: newMemo.id,
    actionBy: maker.id,
    actionType: "CREATE",
  });

  return newMemo;
};
