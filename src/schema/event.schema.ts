import { z } from "zod";

export const createEventSchema = z.object({
    name: z.string().min(3).max(200),
    capacity: z.number().min(1),
    eventDate: z.coerce.date().min(new Date())
})

export type CreateEventInput = z.infer<typeof createEventSchema> & { idCreator: number }