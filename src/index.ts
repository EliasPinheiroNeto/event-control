import App from "./App";
import UserController from "./controllers/UserController";

new App([
    new UserController()
], 3000)