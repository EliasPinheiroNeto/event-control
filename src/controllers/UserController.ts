import { Request, Response } from "express";
import Controller from "./Controller";
import { UserRequests } from "../types/UserRequests";
import prisma from "../prisma/prismaClient";
import UserRequestValidator from "../middlewares/UserRequestValidator";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import AuthService from "../auth/AuthService";

export default class UserController extends Controller {
    constructor() {
        super()
        this.initializeRoutes()
    }

    private initializeRoutes() {
        const userRequestValidator = new UserRequestValidator()
        const authService = new AuthService()

        this.router.get("/users", this.getUsers)
        this.router.get("/users/:id", userRequestValidator.userIdParam, this.getUserById)
        this.router.delete("/users/:id/delete", userRequestValidator.userIdParam, this.deleteUser)
        this.router.patch("/users/:id/edit", authService.authenticateUser, userRequestValidator.updateUserBody, userRequestValidator.userIdParam, this.updateUser)
        this.router.post("/users/new", userRequestValidator.createUserBody, this.createUser)
        this.router.post("/users/login", this.userLogin)
    }

    private async getUsers(req: Request, res: Response) {
        const users = await prisma.user.findMany({
            select: {
                id: true, firstName: true, secondName: true, email: true
            }
        })

        res.send(users)
    }

    private async getUserById(req: Request<any>, res: Response) {
        const id = Number.parseInt(req.params.id)

        const user = await prisma.user.findUnique({
            where: { id },
            select: { id: true, firstName: true, secondName: true, email: true }
        })

        if (!user) {
            return res.status(404).send({ error: "User not found" })
        }

        res.send(user)
    }

    private async deleteUser(req: Request, res: Response) {
        const id = Number.parseInt(req.params.id)
        console.log("TODO: validation token")

        const user = await prisma.user.delete({
            where: { id }
        }).catch(err => {
            if (err instanceof PrismaClientKnownRequestError) {
                return console.log({ error: err.message, route: "/users/:id/delete" })
            }

            console.log({ error: "unknow", route: "/users/:id/delete" })
        })

        if (!user) {
            return res.status(404).send({ error: "User not found" })
        }

        res.send(user)
    }

    private async updateUser(req: Request, res: Response) {
        const id = Number.parseInt(req.params.id)
        const body: UserRequests.UpdateUserBody = req.body

        const user = await prisma.user.update({
            where: { id },
            data: {
                firstName: body.firstName,
                secondName: body.secondName
            },
            select: { id: true, firstName: true, secondName: true, email: true }
        }).catch(err => {
            if (err instanceof PrismaClientKnownRequestError) {
                return console.log({ error: err.message, route: "/users/:id/edit" })
            }

            console.log({ error: "unknow", route: "/users/:id/edit" })
        })

        if (!user) {
            return res.status(404).send({ error: "User not found" })
        }

        res.send(user)
    }

    private async createUser(req: Request, res: Response) {
        const body: UserRequests.CreateUserBody = req.body

        body.password = bcrypt.hashSync(body.password, 10)
        console.log(body.password)

        const user = await prisma.user.create({
            data: body,
            select: { id: true, firstName: true, secondName: true, email: true }
        })

        res.send({ user })
    }

    private async userLogin(req: Request, res: Response) {
        const body: UserRequests.UserLoginBody = req.body

        const user = await prisma.user.findUnique({
            where: {
                email: body.email
            }
        })

        if (!user) {
            return res.status(400).send({ error: "email or password invalid" })
        }

        if (!bcrypt.compareSync(body.password, user.password)) {
            return res.status(400).send({ error: "email or password invalid" })
        }

        const token = jwt.sign({ id: user.id, email: user.email, firstName: user.firstName }, process.env.SECRET, {
            expiresIn: "1h",

        })

        res.send({ user, token })
    }
}