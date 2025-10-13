import { IRegisterUser } from "../types/IRegisterUser";

export const submitRegisterUser = async (token: string, payload: IRegisterUser) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/register`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    console.error("❌ Gagal register:", res.status, await res.text());
    throw new Error("Gagal membuat user baru");
  }

  return res.json();
};
