import "dotenv/config";
import { db } from "../db/db";
import { users } from "../db/schema";
// import { hashPassword } from "../utils/password";

async function main() {
  // Hash password default
  // const hashedPassword = await hashPassword("secret");

  await db.insert(users).values([
    {
      nip: "123456789012345678",
      password: "secret",
      metaToken: "init-token-001",
      email: "teacher1@example.com",
      fullName: "Guru Pertama",
      phoneNumber: "081234567890",
      bornDate: "1990-05-12", // pakai string
      gender: "Male",
      avatarUrl: "https://example.com/avatar1.png",
      signatureUrl: "https://example.com/signature1.png",
    },
    {
      nip: "987654321098765432",
      password: "secret",
      metaToken: "init-token-002",
      email: "teacher2@example.com",
      fullName: "Guru Kedua",
      phoneNumber: "081298765432",
      bornDate: "1992-08-20", // pakai string
      gender: "Female",
      avatarUrl: "https://example.com/avatar2.png",
      signatureUrl: "https://example.com/signature2.png",
    },
  ] as (typeof users.$inferInsert)[]);

  console.log("✅ Seeding selesai!");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
