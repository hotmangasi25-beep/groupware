import { Router } from "express";
import { login, register, changePassword, logout } from "../../controllers/authController";

export const authRoutes = Router();

// endpoint: POST /api/auth/login
authRoutes.post("/login", login);

// endpoint: POST /api/auth/register
authRoutes.post("/register", register);

// endpoint: POST /api/auth/change-password
authRoutes.post("/change-password", changePassword);

// endpoint: POST /api/auth/logout
authRoutes.post("/logout", logout);

export default authRoutes;