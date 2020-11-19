import { route } from "../decorators/route";
import { BaseController } from "./baseController";

export class RandomController extends BaseController {
    
    @route('/api/random')
    get() {
        return `Here is a random number for you: ${Math.round(Math.random() * 100)}`;
    }
}