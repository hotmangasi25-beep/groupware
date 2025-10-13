import { Request, Response } from "express";
import * as authService from "../services/authService";
import * as Message from "../types/constant/errorMessage";

export const login = async (req: Request, res: Response) => {
    try {
        const { nip } = req.body;
        const nipStr = String(nip);
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

export const register = async (req: Request, res: Response) => {
  try {
    const { nip, email, fullName, gender, avatarUrl, signatureUrl, phoneNumber, password } = req.body;

    const result = await authService.register({
      nip,
      email,
      fullName,
      phoneNumber,
      password,
      gender,
      avatarUrl,
      signatureUrl,
    });

    res.status(201).json({
      success: true,
      message: Message.SUCCESS_REGISTER,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const changePassword = async (req: Request, res: Response) => {
    try {
        const { nip, oldPassword, newPassword } = req.body;
        await authService.changePassword(nip, oldPassword, newPassword);
        
        res.json({ message: Message.SUCCESS_CHANGE_PASSWORD });
    } catch (error:any) {
        res.status(400).json({ error: error.message });
    }
}

export const logout = async (req: Request, res:Response) => {
  try {
    const { nip } = req.body;
    await authService.logout(nip);

    return res.json({ success: true, message: Message.SUCCESS_LOGOUT });
  } catch (error:any) {
    return res.status(400).json({ succes: false, error: error.message });
  }
}
