"use server"
import db from "@/db";
import bcrypt from "bcrypt";
import { authTable, userTable } from "@/db/schema";
import { redirect } from "next/navigation";
import validate from "@/validations";
import { createUserSchema } from "@/validations/auth";

export const registerUser = async (name: string, email: string, password: string) => {

    const body = {
        name,
        email,
        password
    }

    const isUserExist = await db.query.userTable.findFirst({
        where: (user, { eq }) => (eq(user.email, body.email))
    });

    if (isUserExist)
        throw new Error("User already exist")

    const hash = await bcrypt.hash(password, 10)

    await db.transaction(async (tx) => {

        const creatingUser = await tx.insert(userTable).values({
            ...body,
            password: hash
        }).returning()

        await tx.insert(authTable).values({
            userId: creatingUser[0].id,
            isVerify: false
        })

    })

    redirect("/login")
} 

export const verifyUser = async(email: string, password: string) => {

}