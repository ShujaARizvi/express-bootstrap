import { UsersController } from "./controllers/usersController";
import express, { json } from 'express';
import { bootstrap } from './bootstrapper';
import { HomeController } from "./controllers/homeController";
import { RandomController } from "./controllers/randomController";

const app = express();

// Configuring the middleware to parse json bodies in requests.
app.use(json());

// Configuring the middleware that will bootstrap the app and register all the controllers.
app.use(bootstrap([
    HomeController,
    UsersController,
    RandomController
]));

// Starting the server.
app.listen(5000, () => console.log('Listening....'));