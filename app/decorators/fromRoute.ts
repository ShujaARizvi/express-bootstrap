import { ParamInfo } from "../entities/paramInfo";
import { RouteInfo } from "../entities/routeInfo";

/**
 * When set on a route parameter, specifies that the parameter comes from the route of the request.
 * @param parameterName Parameter name to be used. Note that the parameter name specified here should match with the one in the route.
 */
export function fromRoute(parameterName: string) {
    return function(target: any, functionKey: string, parameterIndex: number) {
        if (target.hasOwnProperty('routes')) {
            const routes = <RouteInfo[]>target.routes;
            let route = routes.find(x => x.method === functionKey);
            if (!route) {
                route = { 
                    method: functionKey,
                    params: new Array<ParamInfo>(),
                    route: '', 
                    routeRegex: '',
                    routeParamsIndices: []
                };
                target.routes.push(route);
            }
            if (route) {
                route.params = 
                    [new ParamInfo(parameterIndex, parameterName), ...route.params];
            }
        }
    };
}