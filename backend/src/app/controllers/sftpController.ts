import { Request, Response } from "express";
import { sftpService } from "../services/sftpService";


export const sftpController = {
    async testConnection(_req: Request, res: Response){
        try {
            const result = await sftpService.testConnection();
            return res.status(200).json({
                success: true,
                message: result.message,
            });
        } catch (error: unknown) {
            if(error instanceof Error){
                return res.status(500).json({
                success: false,
                message: error.message,
            });
            }
            return res.status(500).json({
                success: false,
                message: "Failed to connect SFTP",
            });
        }
    }
}