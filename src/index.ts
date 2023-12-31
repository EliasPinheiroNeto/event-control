import 'dotenv/config'
import App from "./App";
import UserController from "./controllers/UserController";
import AdminController from './controllers/AdminController';
import EventController from './controllers/EventController';

new App([
    new UserController(),
    new AdminController(),
    new EventController()
], process.env.API_PORT)