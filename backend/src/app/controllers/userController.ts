import { Request, Response } from "express";
import * as userService from "../services/userService";

export const userController = {
    async getAllUsers(req:Request, res:Response){
    try {
        // ambil parameter dari query string
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const result = await userService.getAllUsers(page, limit);

        return res.json({
            success: true,
            data: result.data,
            pagination: result.pagination,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
}