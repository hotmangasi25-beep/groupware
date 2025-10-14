import { Router } from "express";
import { memoController } from "../../controllers/memoController";

export const memoRoutes = Router();

memoRoutes.post("/create-memo", memoController.create);
memoRoutes.post("/submit-memo", memoController.submit);
memoRoutes.post("/approve-memo", memoController.approve);
memoRoutes.post("/revise-memo", memoController.revise);
memoRoutes.get("/", memoController.getAllMemos);

export default memoRoutes;