import {object, string} from "zod";

export const RegisterSchema = object({
    name: string().min(1, "Name is required"),
    email: string().email("Invalid email"),
    password: string().min(8, "Password must be more than 8 characters").max(32, "Password must be less than 32 characters"),
    ConfirmPassword: string().min(8, "Password must be more than 8 characters").max(32, "Password must be less than 32 characters"),
}).refine((data) => data.password === data.ConfirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});