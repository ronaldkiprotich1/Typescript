import { sql } from "drizzle-orm";
import db from "../Drizzle/db";
import { UsersTable } from "../Drizzle/schema";
import { TIUser } from "../Drizzle/schema";

export const createUserService = async (user: TIUser) => {
    const [createdUser] = await db.insert(UsersTable)
        .values(user)
        .returning();
    return createdUser;
};

export const getUserByEmailService = async (email: string) => {
    return await db.query.UsersTable.findFirst({
        where: sql`${UsersTable.email} = ${email}`
    });
};

export const verifyUserService = async (email: string) => {
    const [updatedUser] = await db.update(UsersTable)
        .set({ isVerified: true, verificationCode: null })
        .where(sql`${UsersTable.email} = ${email}`)
        .returning();
    return updatedUser;
};

export const userLoginService = async (email: string) => {
    return await db.query.UsersTable.findFirst({
        where: sql`${UsersTable.email} = ${email}`,
        columns: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            password: true,
            role: true,
            isVerified: true,
            verificationCode: true
        }
    });
};