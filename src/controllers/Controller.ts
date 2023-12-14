import { Router } from "express";

export default abstract class Controller {
    router: Router;

    constructor() {
        this.router = Router()
    }
}