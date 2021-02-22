import { AuthResponse } from "../models/authResponse";
import { Endpoint } from "../models/endpoint";
import { Request } from "../models/request";

export class ControllerAuthInfo {

    /** The callback - Method to call for authentication and authorization */
    callback?: (req: Request, endpoint: Endpoint) => AuthResponse;

    constructor(callback?: (req: Request, endpoint: Endpoint) => AuthResponse) {
        this.callback = callback;
    }
}