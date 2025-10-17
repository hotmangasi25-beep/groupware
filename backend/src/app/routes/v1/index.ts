import express, { type Router } from "express";
import { authRoutes } from "./authRoutes";
import { memoRoutes } from "./memoRoutes";
import { sftpRoutes } from "./sftpRoutes";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { userRoutes } from "./userRoutes";

export const v1Router: Router = express.Router();

v1Router.use("/auth", authRoutes);
v1Router.use("/users", userRoutes);
v1Router.use("/memos", authMiddleware, memoRoutes);
v1Router.use("/sftp", authMiddleware, sftpRoutes);