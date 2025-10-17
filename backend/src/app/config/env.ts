import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: ".env", override: true });

// 🧩 Skema validasi environment
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  HOST: z.string().default("localhost"),
  PORT: z.coerce.number().default(8080),

  JWT_SECRET: z.string().min(1, "JWT_SECRET is required").default("mySuperSecretKey123"),
  JWT_EXPIRES_IN: z.string().default("1h"),
  JWT_TOKEN_TYPE: z.string().default("Bearer"),

  DATABASE_URL: z.string().optional(),

  // Contoh tambahan environment lain (opsional)
  LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info"),
  TIMEZONE: z.string().default("Asia/Jakarta"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment configuration");
}

// 🎯 Export hasil validasi environment
export const env = {
  ...parsed.data,
  isDevelopment: parsed.data.NODE_ENV === "development",
  isProduction: parsed.data.NODE_ENV === "production",
  isTest: parsed.data.NODE_ENV === "test",
};
