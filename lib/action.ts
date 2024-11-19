"use server";

import { prisma } from "../lib/prisma";
import { RegisterSchema } from "./zod";
import { hashSync } from "bcrypt-ts";
import { redirect } from "next/navigation";
import { SignInSchema } from "./zod";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export const signUpCredentials = async (
  prevState: unknown,
  formDate: FormData
) => {
  const validatedFields = RegisterSchema.safeParse(
    Object.fromEntries(formDate.entries())
  );

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validatedFields.data;
  const hashedPassword = hashSync(password, 10);

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  } catch (error) {
    return {
      message: "Failed Register User",
    };
  }

  redirect("/login");
};

export const signInCredentials = async (
  prevState: unknown,
  formDate: FormData
) => {
  const validatedFields = SignInSchema.safeParse(
    Object.fromEntries(formDate.entries())
  );

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    await signIn("credentials", { email, password, redirectTo: "/dashboard" });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            message: "invalid credentials",
          };
        default:
          return {
            message: "something went wrong",
          };
      }


    }
    throw error
  }
};
