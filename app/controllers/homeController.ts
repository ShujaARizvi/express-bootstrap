import { Get } from "../decorators/routingDecorator";
import { BaseController } from "./baseController";

export class HomeController extends BaseController {

    @Get()
    greet() {
        return { message: 'Hello World of Express Typescript' };
    }
}