import { Request, Response } from "express";
import prisma from "../util/prismaClient";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import Controller from "./Controller";
import AuthService from "../auth/AuthService";
import { RequestValidator } from "../middlewares/RequestValidator";
import { CreateUserInput, UpdateUserInput, UserLoginInput, createUserSchema, updateUserSchema, userLoginSchema } from "../schema/user.schema";

export default class UserController extends Controller {
    constructor() {
        super()
        this.initializeRoutes()
    }

    private initializeRoutes() {
        const v = new RequestValidator()
        const auth = new AuthService()

        this.router.get("/users",
            this.getUsers)
        this.router.get("/users/:id",
            [v.requireUser()],
            this.getUserById)
        this.router.delete("/users/:id/delete",
            [v.requireUser(), auth.authenticateUser()],
            this.deleteUser)
        this.router.patch("/users/:id/edit",
            [v.requireUser(), auth.authenticateUser(), v.validate(updateUserSchema)],
            this.updateUser)
        this.router.post("/users/new",
            [v.validate(createUserSchema)],
            this.createUser)
        this.router.post("/users/login",
            [v.validate(userLoginSchema)],
            this.userLogin)
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
            return res.status(404).send()
        }

        res.send(user)
    }

    private async deleteUser(req: Request, res: Response) {
        const id = Number.parseInt(req.params.id)

        const user = await prisma.user.delete({
            where: { id }
        })

        res.send(user)
    }

    private async updateUser(req: Request, res: Response) {
        const id = Number.parseInt(req.params.id)
        const body: UpdateUserInput = req.body

        const user = await prisma.user.update({
            where: { id },
            data: {
                firstName: body.firstName,
                secondName: body.secondName
            },
            select: { id: true, firstName: true, secondName: true, email: true }
        }).catch(err => {
            if (err instanceof PrismaClientKnownRequestError) {
                console.log({ error: err.message, route: "/users/:id/edit" })
                return res.status(400).send()
            }

            console.log({ error: "unknow", route: "/users/:id/edit" })
            return res.status(400).send()
        })

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    }

    private async createUser(req: Request, res: Response) {
        const body: CreateUserInput = req.body
        body.password = bcrypt.hashSync(body.password, 10)

        const user = await prisma.user.create({
            data: body,
            select: { id: true, firstName: true, secondName: true, email: true }
        })

        res.send({ user })
    }

    private async userLogin(req: Request, res: Response) {
        const body: UserLoginInput = req.body

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