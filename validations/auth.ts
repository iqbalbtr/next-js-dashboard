import {z} from "zod"

export const createUserSchema = z.object({
    name: z.string().min(3).max(55).trim(),
    username: z.string().min(6).max(30).toLowerCase().trim(),
    password: z.string().min(3).max(30).toLowerCase().trim(),
})

export const loginUserSchema = z.object({
    username: z.string().min(6).max(30).toLowerCase().trim(),
    password: z.string().min(3).max(30).toLowerCase().trim(),
})