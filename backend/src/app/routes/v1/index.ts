import express, { type Router } from "express";
import { authRoutes } from "./authRoutes";
import { memoRoutes } from "./memoRoutes";

export const v1Router: Router = express.Router();

v1Router.use("/auth", authRoutes);
v1Router.use("/memos", memoRoutes);