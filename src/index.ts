import 'dotenv/config'
import App from "./App";
import UserController from "./controllers/UserController";
import AdminController from './controllers/AdminController';

new App([
    new UserController(),
    new AdminController()
], process.env.API_PORT)