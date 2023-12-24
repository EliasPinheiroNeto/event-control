import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError } from 'jsonwebtoken'

export default class AuthService {
    public authenticate(req: Request, res: Response, next: NextFunction) {
        const token = req.headers.authorization

        if (!token) {
            return res.status(401).send({ error: "no token provided" })
        }

        const parts = token.split(' ')

        if (parts.length != 2) {
            return res.status(401).send({ error: "token malformmated" })
        }

        if (parts[0] != 'Bearer') {
            return res.status(401).send({ error: "token malformmated" })
        }

        try {
            jwt.verify(parts[1], process.env.SECRET)
        } catch (err) {
            if (err instanceof JsonWebTokenError) {
                return res.status(401).send({ error: "token invalid" })
            }
            console.log({ error: "token validation error", route: req.url })
            return res.status(401).send({ error: "token validation error" })
        }

        next()
    }

    public authenticateUser(req: Request, res: Response, next: NextFunction) {
        const id = Number.parseInt(req.params.id)
        const token = req.headers.authorization

        if (!token) {
            return res.status(401).send({ error: "no token provided" })
        }

        const parts = token.split(' ')

        if (parts.length != 2) {
            return res.status(401).send({ error: "token malformmated" })
        }

        if (parts[0] != 'Bearer') {
            return res.status(401).send({ error: "token malformmated" })
        }

        try {
            //TODO: type safety
            const result: any = jwt.verify(parts[1], process.env.SECRET)

            if (id != result.id) {
                return res.status(401).send({ error: "token invalid" })
            }

        } catch (err) {
            if (err instanceof JsonWebTokenError) {
                return res.status(401).send({ error: "token invalid" })
            }
            console.log({ error: "token validation error", route: req.url })
            return res.status(401).send({ error: "token validation error" })
        }

        next()
    }
}