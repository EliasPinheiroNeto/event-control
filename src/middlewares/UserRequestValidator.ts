import { Request, Response, NextFunction } from 'express'
import { ZodError, z } from 'zod'

export default class UserRequestValidator {
    public createUserBody(req: Request, res: Response, next: NextFunction) {
        const createUserSchema = z.object({
            firstName: z.string().min(1).max(100),
            secondName: z.string().min(1).max(100),
            email: z.string().max(150, { message: "'email' is too big, please, cry" }).email(),
            password: z.string().min(8).max(150)
        }).strict()

        try {
            createUserSchema.parse(req.body)
        } catch (err) {
            if (err instanceof ZodError) {
                console.log({ error: "body validation error", route: "/users/new" })
                return res.send(err.flatten())
            }
        }

        next()
    }

    public userIdParam(req: Request, res: Response, next: NextFunction) {
        const userIdParamSchema = z.object({
            id: z.coerce.number()
        })

        try {
            const t = userIdParamSchema.parse(req.params)
        } catch (err) {
            if (err instanceof ZodError) {
                console.log({ error: "params validation error", route: "/users/:id" })
                return res.status(400).send({ error: "user id must be a number. /users/:id[number]" })
            }
        }

        next()
    }

    public updateUserBody(req: Request, res: Response, next: NextFunction) {
        const updateUserSchema = z.object({
            firstName: z.string().min(1).max(100).optional(),
            secondName: z.string().min(1).max(100).optional()
        }).strict()

        try {
            updateUserSchema.parse(req.body)
        } catch (err) {
            if (err instanceof ZodError) {
                console.log({ error: "body validation error", route: "/users/:id/edit" })
                return res.send(err.flatten())
            }
        }

        next()
    }
}