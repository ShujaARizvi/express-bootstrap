import { HTTPMethod, ParamType } from "../constants/enum";
import { ParamInfo } from "../entities/paramInfo";
import { RouteInfo } from "../entities/routeInfo";
import { Model } from "../models/baseModel";

function checkAndCreateRoutesProperty(target: any) {
    if (!target.hasOwnProperty('routes')) {
        Object.defineProperty(target, 'routes', {
            value: new Array<RouteInfo>()
        });
    }
}

function checkAndCreateRoute(target: any, routes: RouteInfo[], key: string) {
    let route = routes.find(x => x.method === key);
    if (!route) {
        route = { 
            method: key,
            httpMethod: HTTPMethod.Get,
            params: new Array<ParamInfo>(),
            route: '', 
            routeRegex: '',
            routeParamsIndices: []
        };
        target.routes.push(route);
    }
    return route;
}

/**
 * Specifies that a controller method is to be exposed as an endpoint.
 * @param route Optional route for the method to be exposed as endpoint. 
 * If not provided, assumes the default for this resource.
 * @param httpMethod Optional http method for the route. 
 * If not provided, assumes the default which is 'GET'.
 */
export function route(route?: string, httpMethod?: HTTPMethod) {
    
    return (target: any, propertyKey: string) => {
        
        // if (!target.hasOwnProperty('routes')) {
        //     Object.defineProperty(target, 'routes', {
        //         value: new Array<RouteInfo>()
        //     });
        // }
        checkAndCreateRoutesProperty(target);

        const controllerName = target.constructor.name.replace('Controller', '').toLowerCase();
        route = route ? route : '';
        route = `/${controllerName}${route}`;

        httpMethod = httpMethod ? httpMethod : HTTPMethod.Get;

        const routeParamsIndices = new Array<number>();
        const splitRoute = route.split('/');

        for (let i = 0; i < splitRoute.length; i++) {
            if (splitRoute[i].startsWith(':')) {
                routeParamsIndices.push(i);
            }
        }

        const queriesOrNone = '(?:[?]{1}.*|)';
        const alphaNumericAny = '[0-9A-Za-z]+';
        // const alphaNumericAny = '(?!.*(\\/|#|\\?)).+';
        const routeParamRegex = /:[0-9A-Za-z]+/g;

        const routes = <RouteInfo[]>target.routes;
        const matchedRoute = routes.find(x => x.method === propertyKey);

        if (matchedRoute) {
            matchedRoute.route = route;
            matchedRoute.httpMethod = httpMethod;
            matchedRoute.routeRegex = '^' + route.replace(/\//g, '\\/').replace(routeParamRegex, alphaNumericAny) + queriesOrNone + '$';
            console.log(matchedRoute.routeRegex);
            matchedRoute.routeParamsIndices = routeParamsIndices;
        } else {
            target.routes.push({ 
                route: route, 
                routeRegex: '^' + route.replace(/\//g, '\\/').replace(routeParamRegex, alphaNumericAny) + queriesOrNone + '$',
                method: propertyKey,
                httpMethod: httpMethod,
                routeParamsIndices: routeParamsIndices,
                params: new Array<ParamInfo>()
            });
        }
    };
}

/**
 * When set on a route parameter, specifies that the parameter comes from the query of the request.
 */
export function fromQuery(model: typeof Model) {
    
    return (target: any, functionKey: string, parameterIndex: number) => {
        
        checkAndCreateRoutesProperty(target);
        
        const routes = <RouteInfo[]>target.routes;
        let route = checkAndCreateRoute(target, routes, functionKey);
        if (route) {
            if (route.params.find(x => x.paramType === ParamType.Query)){
                throw new Error('There cannot be multiple query param models in a single request.');
            }
            route.params = 
                [new ParamInfo(parameterIndex, '', ParamType.Query, model), ...route.params];
        }
    };
}

/**
 * When set on a route parameter, specifies that the parameter comes from the body of the request.
 */
export function fromBody(model: typeof Model) {
    
    return (target: any, functionKey: string, parameterIndex: number) => {
        
        checkAndCreateRoutesProperty(target);
        
        const routes = <RouteInfo[]>target.routes;
        let route = checkAndCreateRoute(target, routes, functionKey);
        if (route) {
            if (route.params.find(x => x.paramType === ParamType.Body)){
                throw new Error('There cannot be multiple bodies in a single request.');
            }
            route.params = 
                [new ParamInfo(parameterIndex, '', ParamType.Body, model), ...route.params];
        }
    };
}

/**
 * When set on a route parameter, specifies that the parameter comes from the route of the request.
 * @param parameterName Parameter name to be used. Note that the parameter name specified here should match with the one in the route.
 */
export function fromRoute(parameterName: string) {
    return function(target: any, functionKey: string, parameterIndex: number) {
        
        checkAndCreateRoutesProperty(target);
        
        const routes = <RouteInfo[]>target.routes;
        let route = checkAndCreateRoute(target, routes, functionKey);
        if (route) {
            route.params = 
                [new ParamInfo(parameterIndex, parameterName, ParamType.Route), ...route.params];
        }
    };
}