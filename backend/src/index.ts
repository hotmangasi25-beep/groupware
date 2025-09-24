import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { db } from "./db";
import { teachers } from "./schema";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/teachers", async (_req, res) => {
  const all = await db.select().from(teachers);
  res.json(all);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
