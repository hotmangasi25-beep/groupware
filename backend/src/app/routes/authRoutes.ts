import { Router } from "express";
import { login, register, changePassword, logout } from "../controllers/authController";

const router = Router();

// endpoint: POST /api/auth/login
router.post("/login", login);

// endpoint: POST /api/auth/register
router.post("/register", register);

// endpoint: POST /api/auth/change-password
router.post("/change-password", changePassword);

// endpoint: POST /api/auth/logout
router.post("/logout", logout);

export default router;