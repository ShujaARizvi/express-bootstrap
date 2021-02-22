import { AuthResponse } from "../models/authResponse";
import { Endpoint } from "../models/endpoint";
import { Request } from "../models/request";

export class RouteAuthInfo {
    /** Name of the method */
    method: string;
    /** The callback - Method to call for authentication */
    callback?: (req: Request, endpoint: Endpoint) => AuthResponse;
    
    constructor(method: string, callback?: (req: Request, endpoint: Endpoint) => AuthResponse) {
        this.method = method;
        this.callback = callback;
    }
}