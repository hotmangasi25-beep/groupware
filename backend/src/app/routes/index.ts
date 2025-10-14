import express, { type Router } from "express";
import { v1Router } from "./v1/index";

export const appRouter: Router = express.Router();
appRouter.use("/v1", v1Router);