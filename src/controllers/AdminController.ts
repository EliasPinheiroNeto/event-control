import { Request, Response } from "express";

import Controller from "./Controller";
import prisma from "../util/prismaClient";
import { CreateAdminInput, createAdminSchema } from "../schema/admin.schema";
import { RequestValidator } from "../middlewares/RequestValidator";
import AuthService from "../auth/AuthService";

export default class AdminController extends Controller {
    constructor() {
        super()
        this.initializeRoutes()
    }

    private initializeRoutes() {
        const v = new RequestValidator()
        const auth = new AuthService()

        this.router.get("/admins",
            [],
            this.getAdmins)

        this.router.post("/admins/add",
            [v.validate(createAdminSchema), auth.authenticateKey],
            this.createAdmin)
    }

    private async getAdmins(req: Request, res: Response) {
        const admins = await prisma.user.findMany({
            where: {
                Admin: {
                    isNot: null
                }
            },
            select: { id: true, firstName: true, secondName: true, email: true }
        })

        res.send(admins)
    }

    private async createAdmin(req: Request, res: Response) {
        const body: CreateAdminInput = req.body

        if (await prisma.admin.findFirst({
            where: {
                idUser: body.id
            }
        })) {
            res.status(409).send({ error: "user is already admin" })
            return
        }

        const admin = await prisma.admin.create({
            data: {
                idUser: body.id
            },
            include: {
                User: {
                    select: { id: true, firstName: true, secondName: true, email: true }
                }
            }
        })

        res.status(201).send(admin)
        return
    }
}