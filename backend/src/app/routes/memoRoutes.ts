import { Router } from "express";
import { createMemoController } from "../controllers/memoController";


const router = Router();

router.post("/", createMemoController);

export default router;