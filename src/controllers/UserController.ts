import { Request, Response } from "express";
import Controller from "./Controller";
import UserValidator from "../middlewares/UserValidator";
import { z } from "zod";

export default class UserController extends Controller {
    constructor() {
        super()
        this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.get("/users", this.getUsers)
        this.router.post("/users/new", UserValidator.usersNew, this.createUser)
    }

    private async getUsers(req: Request, res: Response) {
        const users = await this.prisma.user.findMany({
            select: {
                id: true, firstName: true, secondName: true, email: true
            }
        })

        res.send(users)
    }

    private async createUser(req: Request, res: Response) {
        const body: z.infer<typeof UserValidator.usersNewSchema> = req.body

        const user = await this.prisma.user.create({
            data: body
        })

        res.send({ user })
    }
}