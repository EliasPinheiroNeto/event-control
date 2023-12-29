import { z } from "zod";

export const createUserSchema = z.object({
    firstName: z.string().min(1).max(100),
    secondName: z.string().min(1).max(100),
    email: z.string().max(150, { message: "'email' is too big, please, cry" }).email(),
    password: z.string().min(8).max(150)
}).strict()

export const updateUserSchema = z.object({
    firstName: z.string().min(1).max(100).optional(),
    secondName: z.string().min(1).max(100).optional()
}).strict()

export const userLoginSchema = z.object({
    email: z.string().max(150, { message: "'email' is too big, please, cry" }).email(),
    password: z.string().min(8).max(150)
})


export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type UserLoginInput = z.infer<typeof userLoginSchema>