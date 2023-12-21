import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import Controller from "./Controller";

export default class UserController extends Controller {
    constructor() {
        super()
        this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.get("/users", this.getUsers)
        this.router.post("/users/new", this.createUser)
    }

    private async getUsers(req: Request, res: Response) {
        const p = new PrismaClient()

        const users = await p.user.findMany({
            select: {
                id: true, firstName: true, secondName: true, email: true
            }
        })

        p.$disconnect()
        res.send(users)
    }

    private async createUser(req: Request, res: Response) {
        const { body } = req

        const p = new PrismaClient()
        const user = await p.user.create({
            data: {
                firstName: body.firstName,
                secondName: body.secondName,
                email: body.email,
                password: body.password
            }
        })

        p.$disconnect()
        res.send({ user })
    }
}