import { IncomingHttpHeaders } from "http";
import { ParsedQs } from 'qs'

import { AuthResponse } from "../models/authResponse";

export class RouteAuthInfo {
    method: string;
    callback?: (headers: IncomingHttpHeaders, query: ParsedQs) => AuthResponse;
    
    constructor(method: string, callback?: (headers: IncomingHttpHeaders, query: ParsedQs) => AuthResponse) {
        this.method = method;
        this.callback = callback;
    }
}