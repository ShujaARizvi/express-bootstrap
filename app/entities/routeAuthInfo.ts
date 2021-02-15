import { AuthResponse } from "../models/authResponse";

export class RouteAuthInfo {
    method: string;
    callback?: () => AuthResponse;
    
    constructor(method: string, callback?: () => AuthResponse) {
        this.method = method;
        this.callback = callback;
    }
}