import { PrismaClient } from "@prisma/client";
import { Router } from "express";

export default abstract class Controller {
    public router: Router;
    protected prisma: PrismaClient

    constructor() {
        this.router = Router()
        this.prisma = new PrismaClient()
    }
}