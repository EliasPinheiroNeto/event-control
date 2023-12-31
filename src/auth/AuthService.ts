import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError } from 'jsonwebtoken'

import { UserToken } from "../schema/user.schema";
import { AdminToken } from "../schema/admin.schema";

export default class AuthService {
    private static tokenValidity = "1h"

    public generateUserToken(payload: UserToken) {
        return jwt.sign(payload, process.env.SECRET, {
            expiresIn: AuthService.tokenValidity,
        })
    }

    public genenateAdminToken(payload: AdminToken) {
        return jwt.sign(payload, process.env.SECRET, {
            expiresIn: AuthService.tokenValidity,
        })
    }

    public authenticate() {
        const validateToken = this.validateToken
        return function (req: Request, res: Response, next: NextFunction) {
            const result = validateToken(req, res)

            if (!result) {
                return res.status(400).send()
            }

            next()
        }
    }

    public authenticateUser() {
        const validateToken = this.validateToken
        return function (req: Request, res: Response, next: NextFunction) {
            const result = validateToken(req, res)

            if (!result) {
                return res.status(400).send()
            }

            if (result.id != req.params.id) {
                return res.status(401).send({ error: "token invalid" })
            }

            next()
        }
    }

    public authenticateKey(req: Request, res: Response, next: NextFunction) {
        const key = req.headers['api-key']

        if (!key || key != process.env.API_KEY) {
            res.status(401).send()
            return
        }

        next()
    }

    // === Private methods ===

    private validateToken(req: Request, res: Response) {
        const token = req.headers.authorization

        if (!token) {
            res.status(401).send({ error: "no token provided" })
            return undefined
        }

        const parts = token.split(' ')

        if (parts.length != 2) {
            res.status(401).send({ error: "token malformmated" })
            return undefined
        }

        if (parts[0] != 'Bearer') {
            res.status(401).send({ error: "token malformmated" })
            return undefined
        }

        try {
            return jwt.verify(parts[1], process.env.SECRET) as any
        } catch (err) {
            if (err instanceof JsonWebTokenError) {
                console.log(err)
                res.status(401).send({ error: "token invalid" })
                return undefined
            }
            console.log({ error: "token validation error", route: req.url })
            res.status(401).send({ error: "token validation error" })
            return undefined
        }
    }
}