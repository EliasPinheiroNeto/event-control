import 'dotenv/config'
import App from "./App";
import UserController from "./controllers/UserController";

new App([
    new UserController()
], process.env.API_PORT)