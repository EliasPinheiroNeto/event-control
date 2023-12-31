import { Request, Response } from "express";
import bcrypt from 'bcrypt'

import Controller from "./Controller";
import prisma from "../util/prismaClient";
import { AdminLoginInput, CreateAdminInput, adminLoginSchema, createAdminSchema } from "../schema/admin.schema";
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
            [auth.authenticateAdmin()],
            this.getAdmins)

        this.router.get("/admins/:id",
            [v.requireAdmin(), auth.authenticateAdmin()],
            this.getAdminById)

        this.router.post("/admins/add",
            [v.validate(createAdminSchema), auth.authenticateKey],
            this.createAdmin)

        this.router.post("/admins/login",
            [v.validate(adminLoginSchema)],
            this.adminLogin)

        this.router.delete("/admins/:id/revoke",
            [v.requireAdmin(), auth.authenticateKey],
            this.revokeAdmin)
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

    private async adminLogin(req: Request, res: Response) {
        const body: AdminLoginInput = req.body
        const auth = new AuthService()

        const admin = await prisma.user.findUnique({
            where: {
                email: body.email,
                Admin: {
                    isNot: null
                }
            }
        })

        if (!admin || !bcrypt.compareSync(body.password, admin.password)) {
            return res.status(400).send({ error: "email or password invalid" })
        }

        const token = auth.genenateAdminToken({ id: admin.id, email: admin.email, firstName: admin.firstName })

        admin.password = "-"

        res.send({ admin, token })
    }

    private async getAdminById(req: Request, res: Response) {
        const id = Number.parseInt(req.params.id)

        const admin = await prisma.admin.findFirst({
            where: {
                idUser: id
            },
            include: {
                User: {
                    select: { id: true, firstName: true, secondName: true, email: true }
                }
            }
        })

        res.send(admin)
    }

    private async revokeAdmin(req: Request, res: Response) {
        const id = Number.parseInt(req.params.id)

        await prisma.admin.delete({
            where: {
                idUser: id
            }
        })

        res.send()
    }
}