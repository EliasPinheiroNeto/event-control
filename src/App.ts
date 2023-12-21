import express, { Express } from 'express';
import Controller from './controllers/Controller';

export default class App {
    private express: Express;

    constructor(controllers: Controller[], port: number) {
        this.express = express()

        this.initializeMiddlewares()
        this.initializeControllers(controllers)
        this.listen(port)
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach(controller => {
            this.express.use('/', controller.router);
        })
    }

    private initializeMiddlewares() {
        this.express.use(express.json())
    }

    private listen(port: number) {
        this.express.listen(port, () => {
            console.log(`Application running at port: ${port}`)
        })
    }
}