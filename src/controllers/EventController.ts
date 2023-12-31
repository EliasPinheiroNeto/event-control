import { Request, Response } from "express";

import prisma from "../util/prismaClient";
import Controller from "./Controller";
import { RequestValidator } from "../middlewares/RequestValidator";
import AuthService from "../auth/AuthService";
import { CreateEventInput, createEventSchema } from "../schema/event.schema";

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
                eventDate: new Date(body.eventDate),
                tickets: body.capacity
            }
        })

        res.status(201).send(event)
    }
}