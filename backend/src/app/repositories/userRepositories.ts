import { db } from "../db/db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export const findByNIP = async (nip: string) => {
    console.log("Query Start")
    console.log("NIP Query : ", nip.toString());
    // const result = await db
    // .select()
    // .from(users)
    // .where(eq(users.nip, nip.toString()));
    // console.log("result : ", result);
    const result = await db
    .select({
        id: users.id,
        nip: users.nip,
        password: users.password,
    })
    .from(users)
    .where(eq(users.nip, nip));

    return result[0];
}