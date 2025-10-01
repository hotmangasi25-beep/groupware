import { db } from "../db/db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { generateUUID, comparePassword, hashPasswordNew } from "../utils/password";
import { generateToken } from "../utils/jwt";
import * as userRepository from "../repositories/userRepositories";
import * as errorMessage from "../types/constant/errorMessage";

export const register = async (userData: {
  nip: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  password: string;
}) => {
  // cek apakah user sudah ada
  const existingUser = await userRepository.findByNIP(userData.nip);
  if (existingUser) {
    throw new Error(errorMessage.USER_ALREADY_EXIST);
  }

  // generate uuid
  const uuid = generateUUID();

  // hash password
  const hashedPassword = await hashPasswordNew(userData.password, uuid);
  console.log("This is value od hashedPassword: ", hashedPassword);

  // simpan ke DB
  const newUser = await userRepository.createUser({
    nip: userData.nip,
    email: userData.email,
    fullName: userData.fullName,
    phoneNumber: userData.phoneNumber,
    password: hashedPassword,
    metaToken: null, // default
    bornDate: null,
    gender: null,
    avatarUrl: null,
    signatureUrl: null,
  });

  // buat token JWT
  const token = generateToken({ id: newUser.id, nip: newUser.nip });

  return { user: newUser, token };
};

export const findByNIP = async (nip: string) => {
    try {
        const result = await db
            .select()
            .from(users)
            .where(eq(users.nip, nip));

        console.log("Query result:", result);
        return result[0];
    } catch (err) {
        console.error("Query error:", err);
        throw err;
    }
};

export const changePassword = async (
    nip : string,
    oldPassword: string,
    newPassword: string
) => {
    const user = await userRepository.findByNIP(nip);
    console.log("User Response: ", user);
    if(!user){
        throw new Error(errorMessage.USER_NOT_FOUND);
    }

    const isMatch = await comparePassword(oldPassword, newPassword);
    if(isMatch){
        throw new Error(errorMessage.PASSWORD_IS_MATCH);
    }
    // generate uuid
    const uuid = generateUUID();

    const hashedPassword = await hashPasswordNew(newPassword, uuid);

    await userRepository.updatePassword(nip, hashedPassword);
}

export const logout = async (nip: string) => {
  const user = await userRepository.findByNIP(nip);
  if(!user){
    throw new Error(errorMessage.USER_NOT_FOUND);
  }

  // set metaToken menjadi null
  await userRepository.logout(nip, null);
}
