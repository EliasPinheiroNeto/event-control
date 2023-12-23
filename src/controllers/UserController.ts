import { Request, Response } from "express";
import Controller from "./Controller";
import UserValidator, { UserSchema } from "../middlewares/UserValidator";
import prisma from "../prisma/prismaClient";

export default class UserController extends Controller {
    constructor() {
        super()
        this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.get("/users", this.getUsers)
        this.router.get("/users/:id", this.getUserById)
        this.router.delete("/users/:id/delete", this.deleteUser)
        this.router.post("/users/new", UserValidator.createUser, this.createUser)
    }

    private async getUsers(req: Request, res: Response) {
        const users = await prisma.user.findMany({
            select: {
                id: true, firstName: true, secondName: true, email: true
            }
        })

        res.send(users)
    }

    private async getUserById(req: Request, res: Response) {
        const id = Number.parseInt(req.params.id)

        if (isNaN(id)) {
            return res.status(400).send({ error: "user id must be a number. /users/:id[number]" })
        }

        const user = await prisma.user.findUnique({
            where: { id },
            select: { id: true, firstName: true, secondName: true, email: true }
        })

        if (!user) {
            return res.status(404).send({ error: "User not found" })
        }

        res.send(user)
    }

    private async createUser(req: Request, res: Response) {
        const body: UserSchema.create = req.body

        const user = await prisma.user.create({
            data: body
        })

        res.send({ user })
    }

    private async deleteUser(req: Request, res: Response) {
        const id = Number.parseInt(req.params.id)

        console.log("TODO: validation token")

        if (isNaN(id)) {
            return res.status(400).send({ error: "user id must be a number. /users/:id[number]/delete" })
        }

        const user = await prisma.user.findUnique({
            where: { id },
            select: { id: true, firstName: true, secondName: true, email: true }
        })

        if (!user) {
            return res.status(404).send({ error: "User not found" })
        }

        await prisma.user.delete({
            where: { id }
        })

        res.send(user)
    }
}