import express from "express";
import authRoutes from "./app/routes/authRoutes";

const app = express();

app.use(express.json());

// prefix: /api/auth

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backends running at http://localhost:${PORT}`);
});
