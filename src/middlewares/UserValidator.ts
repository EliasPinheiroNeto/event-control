import { Request, Response, NextFunction } from 'express'
import { ZodError, z } from 'zod'

export default class UserValidator {
    public static createUserSchema = z.object({
        firstName: z.string().min(1).max(100),
        secondName: z.string().min(1).max(100),
        email: z.string().max(150, { message: "'email' is too big, please, cry" }).email(),
        password: z.string().min(8).max(150)
    }).strict()

    public static createUser(req: Request, res: Response, next: NextFunction) {
        try {
            UserValidator.createUserSchema.parse(req.body)
        } catch (err) {
            if (err instanceof ZodError) {
                console.log({ error: "body validation error", route: "/users/new" })
                return res.send(err.flatten())
            }
        }

        next()
    }
}

export namespace UserSchema {
    export type create = z.infer<typeof UserValidator.createUserSchema>
}