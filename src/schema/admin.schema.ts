import { z } from "zod";

export const createAdminSchema = z.object({
    id: z.number()
})

export const adminLoginSchema = z.object({
    email: z.string().max(150, { message: "'email' is too big, please, cry" }).email(),
    password: z.string().min(8).max(150)
})

export const adminTokenSchema = z.object({
    id: z.number(),
    email: z.string().email(),
    firstName: z.string()
}).strict()

export type CreateAdminInput = z.infer<typeof createAdminSchema>
export type AdminLoginInput = z.infer<typeof adminLoginSchema>
export type AdminToken = z.infer<typeof adminTokenSchema>