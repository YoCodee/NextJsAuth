"use server";

import {prisma} from "../lib/prisma"
import { RegisterSchema } from "./zod";
import { hashSync } from "bcrypt-ts";
import { redirect } from "next/navigation";

export const signUpCredentials = async (prevState : unknown, formDate: FormData) => {

    const validatedFields = RegisterSchema.safeParse(Object.fromEntries(formDate.entries()));

    if(!validatedFields.success) {
        return {
            error: validatedFields.error.flatten().fieldErrors
        }
    }

    const {name, email, password} = validatedFields.data;
    const hashedPassword = hashSync(password, 10);

    try{
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        })


    } catch (error) {
        return {
            message: "Failed Register User"
        }
    }

    redirect("/login")

}