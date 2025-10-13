import express from "express";
import cors from "cors"; // ✅ Tambahkan ini
import authRoutes from "./app/routes/authRoutes";

const app = express();

// ✅ Aktifkan middleware CORS sebelum routes
app.use(cors({
  origin: "http://localhost:3000", // frontend kamu
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// ✅ Middleware untuk parsing JSON
app.use(express.json());

// ✅ Prefix API
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
