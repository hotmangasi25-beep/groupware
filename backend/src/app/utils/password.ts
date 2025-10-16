import bycrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const SALT_ROUNDS = 10;

export function generateUUID(){
    return uuidv4();
}

export const hashPassword = async (password: string) => {
    return await bycrypt.hash(password, 10);
}

export async function hashPasswordNew(password: string, uuid:string) {
    const combined = password + uuid;
    const hashed = await bycrypt.hash(combined, SALT_ROUNDS);
    return hashed;
}

export async function comparePasswordNew(inputPassword : string, uuid: string, storeHash: string) {
    const combined = inputPassword + uuid;
    return await bycrypt.compare(combined, storeHash);
}

export const comparePassword = async(password: string, hash: string) => {
    return await bycrypt.compare(password, hash);
}