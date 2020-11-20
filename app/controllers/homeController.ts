import { route } from "../decorators/routeDecorators";
import { BaseController } from "./baseController";

export class HomeController extends BaseController {

    @route()
    greet() {
        return 'Hello World of Express Typescript';
    }
}