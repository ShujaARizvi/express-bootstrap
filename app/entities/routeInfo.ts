import { HTTPMethod } from "../constants/enum";
import { ParamInfo } from "./paramInfo";

export class RouteInfo {
    /**
     * The user specified route.
     */
    route: string;
    /**
     * The regex created to match api calls for a route.
     */
    routeRegex: string;
    /**
     * Name of the method to execute for an api call. The route handler's name.
     */
    method: string;
    /**
     * Indices of all the route params.
     */
    routeParamsIndices: number[];
    /**
     * The actual params. 
     */
    params: ParamInfo[];
    /**
     * The HTTP method for this call.
     */
    httpMethod: HTTPMethod;

    constructor() {
        this.routeParamsIndices = new Array<number>();
        this.params = new Array<ParamInfo>();
    }
}