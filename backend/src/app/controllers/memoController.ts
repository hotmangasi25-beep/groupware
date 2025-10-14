import { Request, Response } from "express";
import { memoService } from "../services/memoService";

export const memoController = {
    async create(req: Request, res: Response){
        try{
            const { title, content, makerId} = req.body;
            const memo = await memoService.createMemo(makerId, title, content);
            res.status(201).json({ success: true, data: memo });
        } catch (err: any){
            res.status(400).json({ success: false, message: err.message });
        }
    },

    async submit(req: Request, res: Response){
        try {
            const { memoId, userId } = req.body;
            await memoService.submitMemo(memoId, userId);
            res.json({ success: true, message: "Memo dikirim ke checker" });
        } catch (err: any) {
            res.status(400).json({ success: false, message: err.message });
        }
    },

    async approve(req: Request, res: Response){
        try {
            const { memoId, userId } = req.body;
            await memoService.approveMemo(memoId, userId);
            res.json({ success: true, message: "Memo Disetujui" })
        } catch (err: any) {
            res.status(400).json({ success: false, message: err.message });
        }
    },

    async revise(req: Request, res: Response){
        try {
            const { memoId, userId, remarks } = req.body;
            await memoService.reviseMemo(memoId, userId, remarks);
            res.json({ success: true, message: "Memo Direvisi" });
        } catch (err: any) {
            res.status(400).json({ success: false, message: err.message });
        }
    },

    async getAllMemos(_req: Request, res: Response) {
        const data = await memoService.getAll();
        res.json({ success: true, data });
        },
};