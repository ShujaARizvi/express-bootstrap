import { route } from "../decorators/route";
import { BaseController } from "./baseController";

export class HomeController extends BaseController {

    @route('/api/home')
    greet() {
        return 'Hello World of Express Typescript';
    }
}