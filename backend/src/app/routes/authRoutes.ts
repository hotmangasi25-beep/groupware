import { Router } from "express";
import { login } from "../controllers/authController";

const router = Router();

// endpoint: POST /api/auth/login
console.log("Login Routes start");
router.post("/login", login);

export default router;