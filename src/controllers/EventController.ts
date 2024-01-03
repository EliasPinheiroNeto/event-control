import { Request, Response } from "express";
import qrcode from 'qrcode'

import prisma from "../util/prismaClient";
import Controller from "./Controller";
import { RequestValidator } from "../middlewares/RequestValidator";
import AuthService from "../auth/AuthService";
import { AddUserToEventInput, CreateEventInput, GetUserQRCodeInput, RemoveUserFromEventInput, UpdateEventInput, createEventSchema, updateEventSchema } from "../schema/event.schema";

export default class EventController extends Controller {
    constructor() {
        super()
        this.initializeRoutes()
    }

    private initializeRoutes() {
        const v = new RequestValidator()
        const auth = new AuthService()

        this.router.get("/events",
            [],
            this.getEvents)

        this.router.get("/events/:id",
            [v.requireEvent()],
            this.getEventById)

        this.router.post("/events/new",
            [v.validate(createEventSchema), auth.authenticateAdmin()],
            this.createEvent)

        this.router.patch("/events/:id/edit",
            [v.validate(updateEventSchema), v.requireEvent(), auth.authenticateAdminEventOwner()],
            this.updateEvent)

        this.router.delete("/events/:id/delete",
            [v.requireEvent(), auth.authenticateAdminEventOwner()],
            this.deleteEvent)

        this.router.get("/events/:id/users",
            [v.requireEvent(), auth.authenticateAdmin()],
            this.getUsersByEvent)

        this.router.post("/events/:id/users/add",
            [v.requireEvent(), auth.authenticateUser()],
            this.addUserToEvent)

        this.router.delete("/events/:id/users/remove",
            [v.requireEvent(), auth.authenticateUser()],
            this.removeUserFromEvent)

        this.router.patch("/events/:id/users/check-in",
            [],
            this.checkInUser)

        this.router.get("/events/:id/users/qrcode",
            [v.requireEvent(), auth.authenticateUser()],
            this.getUserQRCode)
    }

    private async getEvents(req: Request, res: Response) {
        const events = await prisma.event.findMany()

        res.send(events)
    }

    private async getEventById(req: Request, res: Response) {
        const id = Number.parseInt(req.params.id)

        const event = await prisma.event.findUnique({
            where: { id }
        })

        res.send(event)
    }

    private async createEvent(req: Request, res: Response) {
        const body: CreateEventInput = req.body

        const event = await prisma.event.create({
            data: {
                ...body,
                tickets: body.capacity,
                eventDate: new Date(body.eventDate)
            }
        })

        res.status(201).send(event)
    }

    private async updateEvent(req: Request, res: Response) {
        const id = Number.parseInt(req.params.id)
        const body: UpdateEventInput = req.body

        const event = await prisma.event.findUnique({ where: { id } })

        if (!event) {
            res.status(500).send()
            return
        }

        if (body.capacity) {
            if (!(event.capacity - body.capacity <= event.tickets)) {
                res.status(400).send({ error: "increase the capacity, too much tickets already sold" })
                return
            }

            event.tickets -= (event.capacity - body.capacity)
        }

        const result = await prisma.event.update({
            where: { id },
            data: {
                ...body,
                tickets: event.tickets,
                eventDate: body.eventDate ? new Date(body.eventDate) : undefined
            }
        })

        res.send(result)
    }

    private async deleteEvent(req: Request, res: Response) {
        const id = Number.parseInt(req.params.id)

        const event = await prisma.event.delete({
            where: { id }
        })

        res.send(event)
    }

    private async getUsersByEvent(req: Request, res: Response) {
        const id = Number.parseInt(req.params.id)

        const users = await prisma.user.findMany({
            where: {
                UserEvent: {
                    some: {
                        idEvent: id
                    }
                }
            },
            select: { id: true, firstName: true, secondName: true, email: true }
        })

        res.send(users)
    }

    private async addUserToEvent(req: Request, res: Response) {
        const id = Number.parseInt(req.params.id)
        const body: AddUserToEventInput = req.body

        if (await prisma.userEvent.findFirst({
            where: {
                idEvent: id,
                idUser: body.idUser
            }
        })) {
            res.status(409).send({ error: "user already on event" })
            return
        }

        const userEvent = await prisma.userEvent.create({
            data: {
                idEvent: id,
                idUser: body.idUser
            },
            select: {
                Event: true,
                User: {
                    select: { id: true, firstName: true, secondName: true, email: true }
                }
            }
        })

        res.send(userEvent)
    }

    private async removeUserFromEvent(req: Request, res: Response) {
        const id = Number.parseInt(req.params.id)
        const body: RemoveUserFromEventInput = req.body

        if (!await prisma.userEvent.findUnique({
            where: {
                idUser_idEvent: {
                    idEvent: id,
                    idUser: body.idUser
                }
            }
        })) {
            res.status(404).send({ error: "user is not on event" })
            return
        }

        const userEvent = await prisma.userEvent.delete({
            where: {
                idUser_idEvent: {
                    idEvent: id,
                    idUser: body.idUser
                }
            }
        })

        res.send(userEvent)
    }

    private async checkInUser(req: Request, res: Response) {
        const id = Number.parseInt(req.params.id)


    }

    private async getUserQRCode(req: Request, res: Response) {
        const id = Number.parseInt(req.params.id)
        const body: GetUserQRCodeInput = req.body

        const auth = new AuthService()

        const token = auth.generateUserEventToken({ idEvent: id, idUser: body.idUser })
        qrcode.toDataURL(token, { type: "image/jpeg" }).then((url) => {
            res.send({ image: url })
        }).catch(err => {
            res.status(500).send()
        })
    }
}