import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError } from 'jsonwebtoken'

import { UserToken } from "../schema/user.schema";
import { AdminToken } from "../schema/admin.schema";

export default class AuthService {
    private static tokenValidity = "1h"

    // === Token generation methods ===

    public generateUserToken(payload: UserToken) {
        return jwt.sign(payload, process.env.SECRET, {
            expiresIn: AuthService.tokenValidity,
        })
    }

    public genenateAdminToken(payload: AdminToken) {
        return jwt.sign(payload, process.env.ADMIN_SECRET, {
            expiresIn: AuthService.tokenValidity,
        })
    }

    // === Authentication methods ===

    public authenticateUser() {
        const validateToken = this.validateUserToken
        return function (req: Request, res: Response, next: NextFunction) {
            const result = validateToken(req, res)

            if (!result) {
                return res.status(400).send()
            }

            next()
        }
    }

    public authenticateUserOwner() {
        const validateUserToken = this.validateUserToken
        return function (req: Request, res: Response, next: NextFunction) {
            const result = validateUserToken(req, res)

            if (!result) {
                return res.status(400).send()
            }

            if (result.id != req.params.id) {
                return res.status(401).send({ error: "token invalid" })
            }

            next()
        }
    }

    public authenticateAdmin() {
        const validateAdminToken = this.validateAdminToken
        return function (req: Request, res: Response, next: NextFunction) {
            const result = validateAdminToken(req, res)

            if (!result) {
                res.status(400).send()
                return
            }

            next()
        }
    }

    public authenticateAdminOwner() {
        const validateAdminToken = this.validateAdminToken
        return function (req: Request, res: Response, next: NextFunction) {
            const result = validateAdminToken(req, res)

            if (!result) {
                res.status(400).send()
                return
            }

            //.... Test id

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

    private validateTokenHeader(req: Request, res: Response) {
        const token = req.headers.authorization

        if (!token) {
            res.status(401).send({ error: "no token provided" })
            return
        }

        const parts = token.split(' ')

        if (parts.length != 2) {
            res.status(401).send({ error: "token malformmated" })
            return
        }

        if (parts[0] != 'Bearer') {
            res.status(401).send({ error: "token malformmated" })
            return
        }

        return parts[1]
    }

    private validateUserToken(req: Request, res: Response) {
        const token = this.validateTokenHeader(req, res)

        if (!token) {
            return
        }

        try {
            return jwt.verify(token, process.env.SECRET) as any
        } catch (err) {
            if (err instanceof JsonWebTokenError) {
                console.log(err)
                res.status(401).send({ error: "token invalid" })
                return
            }
            console.log({ error: "token validation error", route: req.url })
            res.status(401).send({ error: "token validation error" })
            return
        }
    }

    private validateAdminToken(req: Request, res: Response) {
        const token = this.validateTokenHeader(req, res)

        if (!token) {
            return
        }

        try {
            return jwt.verify(token, process.env.ADMIN_SECRET) as any
        } catch (err) {
            if (err instanceof JsonWebTokenError) {
                console.log(err)
                res.status(401).send({ error: "token invalid" })
                return
            }
            console.log({ error: "token validation error", route: req.url })
            res.status(401).send({ error: "token validation error" })
            return
        }
    }
}