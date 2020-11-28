import express, { json } from 'express';
import { bootstrap } from './bootstrapper';

// Importing all controllers to bootstrap
import { HomeController } from "./controllers/homeController";
import { UsersController } from "./controllers/usersController";
import { RandomController } from "./controllers/randomController";

const app = express();

// Configuring the middleware to parse json bodies in requests.
app.use(json());

// Configuring the middleware that will bootstrap the app and register all the controllers.
app.use(bootstrap({
    base: '/api',
    controllers: [
        HomeController,
        UsersController,
        RandomController,
    ]
}));

// Starting the server.
app.listen(5000, () => console.log('Listening....'));