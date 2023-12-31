import { z } from "zod";

export const createAdminSchema = z.object({
    id: z.number()
})

export type CreateAdminInput = z.infer<typeof createAdminSchema>