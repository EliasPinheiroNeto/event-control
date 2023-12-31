import { NextFunction, Request, Response } from 'express'
import { AnyZodObject, ZodError, z } from 'zod'
import prisma from '../util/prismaClient'

export class RequestValidator {
    public validate(schema: AnyZodObject) {
        return function (req: Request, res: Response, next: NextFunction) {
            try {
                schema.parse(req.body)
                next()
            } catch (err) {
                if (err instanceof ZodError) {
                    return res.status(400).send(err.flatten())
                }

                console.log({ error: "body validation error", route: req.url })
                return res.status(400)
            }
        }
    }

    public requireId() {
        const checkId = this.checkId
        return function (req: Request, res: Response, next: NextFunction) {
            const id = checkId(req, res)

            if (typeof id == 'number') {
                next()
            }
        }
    }

    public requireUser() {
        const checkId = this.checkId
        return async function (req: Request, res: Response, next: NextFunction) {
            const id = checkId(req, res)

            if (typeof id == 'number') {
                const user = await prisma.user.findUnique({
                    where: { id }
                })

                if (!user) {
                    return res.status(404).send({ error: "User not found" })
                }

                next()
            }
        }
    }

    public requireAdmin() {
        const checkId = this.checkId
        return async function (req: Request, res: Response, next: NextFunction) {
            const id = checkId(req, res)

            if (!id) {
                res.status(400).send()
                return
            }


            const admin = await prisma.admin.findUnique({
                where: { idUser: id }
            })

            if (!admin) {
                res.status(404).send({ error: "User not found" })
                return
            }

            next()
        }
    }

    // === Private methods ===

    private checkId(req: Request, res: Response) {
        const paramsSchema = z.object({
            id: z.coerce.number()
        })

        try {
            const params = paramsSchema.parse(req.params)
            return params.id
        } catch (err) {
            if (err instanceof ZodError) {
                res.status(400).send({ error: `unknow '${Object.values(req.params)}'` })
                return
            }
            console.log({ error: "params validation error", route: req.url })
            res.status(400).send()
            return
        }
    }
}