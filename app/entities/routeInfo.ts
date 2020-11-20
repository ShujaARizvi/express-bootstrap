import { HTTPMethod } from "../constants/enum";
import { ParamInfo } from "./paramInfo";

export class RouteInfo {
    route: string;
    routeRegex: string;
    method: string;
    routeParamsIndices: number[];
    params: ParamInfo[];
    httpMethod: HTTPMethod;

    constructor() {
        this.routeParamsIndices = new Array<number>();
        this.params = new Array<ParamInfo>();
    }
}