import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'

export default class AuthService {
    public authenticateUser(req: Request, res: Response, next: NextFunction) {
        const token = req.headers.authorization

        if (!token) {
            return res.status(401).send({ error: "no token provided" })
        }

        const parts = token.split(' ')

        if (parts.length != 2) {
            return res.status(401).send({ error: "the request needs a valid authentication token" })
        }

        if (parts[0] != 'Bearer') {
            return res.status(401).send({ error: "token malformatted" })
        }

        try {
            jwt.verify(parts[1], process.env.SECRET)
        } catch (err) {
            return res.status(401).send({ error: "token invalid" })
        }

        next()
    }
}