import { PrismaClient } from "@prisma/client";
import { Router } from "express";

export default abstract class Controller {
    public router: Router;

    constructor() {
        this.router = Router()
    }
}