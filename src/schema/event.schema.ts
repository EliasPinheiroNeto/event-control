import { z } from "zod";

export const createEventSchema = z.object({
    name: z.string().min(3).max(200),
    capacity: z.number().min(1),
    eventDate: z.coerce.date().min(new Date())
})

export const updateEventSchema = z.object({
    name: z.string().min(3).max(200).optional(),
    capacity: z.number().min(1).optional(),
    eventDate: z.coerce.date().min(new Date()).optional()
}).strict()

export type CreateEventInput = z.infer<typeof createEventSchema> & { idCreator: number }
export type UpdateEventInput = z.infer<typeof updateEventSchema> & { idCreator: number }
export type AddUserToEventInput = { idUser: number }