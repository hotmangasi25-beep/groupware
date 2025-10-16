import Router from "express";
import { sftpController } from "../../controllers/sftpController";

export const sftpRoutes = Router();

sftpRoutes.get("/testSftp", sftpController.testConnection);

export default sftpRoutes;