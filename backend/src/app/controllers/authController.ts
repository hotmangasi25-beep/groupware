import { Request, Response } from "express";
import * as authService from "../services/authService";

export const login = async (req: Request, res: Response) => {
    try {
        const { nip } = req.body;
        const nipStr = String(nip);
        console.log("Controller start");
        console.log("nipStr : ", nipStr);
        const token = await authService.findByNIP(nipStr);
        console.log("Token result", token);
        res.json({
            succes: true,
            token,
        });
    } catch (error: any) {
        res.status(400).json({
            succes: false,
            message: error.message,
        });
    }
}
