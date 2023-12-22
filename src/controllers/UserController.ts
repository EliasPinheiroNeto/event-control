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

    private async createUser(req: Request, res: Response) {
        const body: UserSchema.create = req.body

        const user = await prisma.user.create({
            data: body
        })

        res.send({ user })
    }
}