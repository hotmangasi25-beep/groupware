import bycrypt from "bcryptjs";

export const hashPassword = async (password: string) => {
    return await bycrypt.hash(password, 10);
}

export const comparePassword = async(password: string, hash: string) => {
    return await bycrypt.compare(password, hash);
}