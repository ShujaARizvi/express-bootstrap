import { route } from "../decorators/routingDecorator";
import { BaseController } from "./baseController";

export class RandomController extends BaseController {
    
    @route()
    get() {
        return `Here is a random number for you: ${Math.round(Math.random() * 100)}`;
    }
}