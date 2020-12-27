import { Get } from "../decorators/routingDecorator";
import { BaseController } from "./baseController";

export class RandomController extends BaseController {
    
    @Get()
    get() {
        return `Here is a random number for you: ${Math.round(Math.random() * 100)}`;
    }
}