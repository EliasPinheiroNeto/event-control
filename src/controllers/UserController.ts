import { Request, Response } from "express";
import Controller from "./Controller";

export default class UserController extends Controller {
    constructor() {
        super()
        this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.get("/users", this.getusers)
    }

    private getusers(req: Request, res: Response) {
        res.send({ status: "ok" })
    }
}