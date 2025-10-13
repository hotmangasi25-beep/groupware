"use client";

import { useState } from "react";
import { submitRegisterUser } from "../../../services/RegisterUserService"
import { IRegisterUser } from "../../../types/IRegisterUser";

export default function RegisterUserForm() {
  const [form, setForm] = useState<IRegisterUser>({
    nip: "",
    email: "",
    fullName: "",
    phoneNumber: "",
    password: "",
    metaToken: "",
    bornDate: null,
    gender: "",
    avatarUrl: "",
    signatureUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = "YOUR_STATIC_TOKEN_HERE"; // nanti ganti dengan token login aktif
      const response = await submitRegisterUser(token, form);
      console.log("✅ Register Success:", response);
      setMessage("Registrasi berhasil!");
    } catch (err: any) {
      console.error(err);
      setMessage("❌ Registrasi gagal!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Register User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["nip", "email", "fullName", "phoneNumber", "gender","avatarUrl", "signatureUrl", "password"].map((key) => (
          <div key={key}>
            <label className="block text-gray-600 capitalize">{key}</label>
            <input
              type={key === "password" ? "password" : "text"}
              name={key}
              value={(form as any)[key]}
              onChange={handleChange}
              required
              className="w-full border rounded-md p-2 mt-1 focus:ring focus:ring-blue-200"
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Mendaftarkan..." : "Daftar"}
        </button>
      </form>

      {message && (
        <p
          className={`mt-4 text-center font-semibold ${
            message.includes("berhasil") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
