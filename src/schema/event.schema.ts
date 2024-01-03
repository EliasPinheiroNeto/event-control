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

export const userEventTokenSchema = z.object({
    idUser: z.coerce.number(),
    idEvent: z.coerce.number()
})

export type CreateEventInput = z.infer<typeof createEventSchema> & { idCreator: number }
export type UpdateEventInput = z.infer<typeof updateEventSchema> & { idCreator: number }
export type AddUserToEventInput = { idUser: number }
export type RemoveUserFromEventInput = { idUser: number }
export type GetUserQRCodeInput = { idUser: number }
export type UserEventToken = z.infer<typeof userEventTokenSchema>