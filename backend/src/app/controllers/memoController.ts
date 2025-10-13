import { Request, Response } from "express";
import * as Message from "../types/constant/errorMessage";
import { createMemo  } from "../services/memoService";

export async function createMemoController(req: Request, res: Response) {
    try {
        const { makerId, title, content, recipients, cc } = req.body;
        if(!makerId || !title || !content || !recipients){
            return res.status(400).json({ message: Message.INVALID_REQUEST })
        }

        const memo = await createMemo({
            makerId,
            title,
            content,
            recipients,
            cc,
        });

        res.status(201).json({
            message: Message.MEMO_SUCCESSFULL,
            data: memo,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}



