import { ParamInfo } from "../entities/paramInfo";
import { RouteInfo } from "../entities/routeInfo";

export function route(route: string) {
    
    return (target: any, propertyKey: string) => {
        
        if (!target.hasOwnProperty('routes')) {
            Object.defineProperty(target, 'routes', {
                value: new Array<RouteInfo>()
            });
        }

        const routeParamsIndices = new Array<number>();
        const splitRoute = route.split('/');

        for (let i = 0; i < splitRoute.length; i++) {
            if (splitRoute[i].startsWith(':')) {
                routeParamsIndices.push(i);
            }
        }

        const queriesOrNone = '(?:[?]{1}.*|)';
        const alphaNumericAny = '[A-Za-z0-9]+';
        const routeParamRegex = /:[0-9A-Za-z]+/g;

        const routes = <RouteInfo[]>target.routes;
        const matchedRoute = routes.find(x => x.method === propertyKey);

        if (matchedRoute) {
            matchedRoute.route = route;
            matchedRoute.routeRegex = '^' + route.replace(/\//g, '\\/').replace(routeParamRegex, alphaNumericAny) + queriesOrNone + '$';
            matchedRoute.routeParamsIndices = routeParamsIndices;
        } else {
            target.routes.push({ 
                route: route, 
                routeRegex: '^' + route.replace(/\//g, '\\/').replace(routeParamRegex, alphaNumericAny) + queriesOrNone + '$',
                method: propertyKey,
                routeParamsIndices: routeParamsIndices,
                params: new Array<ParamInfo>()
            });
        }
    };

}