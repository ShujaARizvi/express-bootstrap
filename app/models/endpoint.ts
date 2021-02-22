import { HTTPMethod } from "../constants/enum";

export class Endpoint {
    /**
     * The user specified route.
     */
    route: string;
    /**
     * Name of the controller which contains the target endpoint.
     */
    controller: string;
    /**
     * Name of the method that will execute for this api call aka the route handler's name.
     */
    method: string;
    /**
     * The HTTP method for this call.
     */
    httpMethod: HTTPMethod;

    constructor(route: string, controller: string, method: string, httpMethod: HTTPMethod) {
        this.route = route;
        this.controller = controller;
        this.method = method;
        this.httpMethod = httpMethod;
    }
}