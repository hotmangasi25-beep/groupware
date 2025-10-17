import jwt from "jsonwebtoken";
import { env } from "../config/env";

const JWT_SECRET: jwt.Secret = env.JWT_SECRET;

export const generateToken = (payload: object)=> {
    const token = jwt.sign(payload, JWT_SECRET as jwt.Secret, { expiresIn: "1h" });
    return token;
};