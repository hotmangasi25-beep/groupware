import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import * as errorMessage from "../types/constant/errorMessage";

const JWT_SECRET = process.env.JWT_SECRET || "mySuperSecretKey123";

export const authMiddleware = (req: Request, res:Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        res.status(401).json({ success: false, message:  errorMessage.AUTHORIZATION_TOKEN});
        return
    }

    const token = authHeader.split(" ")[1];
    if(!token){
        throw new Error("Invalid token");
    }
    console.log("This is token value: ", token);

    try {
        // Verifikasi token
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        // simpan payload user di request, bisa digunakan di controller
        (req as any).user = decoded;
        next();
    } catch (err) {
         res.status(403).json({ success: false, message: errorMessage.INVALID_TOKEN });
         return
    }
}
    

