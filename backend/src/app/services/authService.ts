import { db } from "../db/db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export const findByNIP = async (nip: string) => {
    console.log("Query Start");
    console.log("NIP Query : ", nip);

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
