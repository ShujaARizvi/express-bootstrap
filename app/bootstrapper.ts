import { BaseController } from "./controllers/baseController";
import { ControllersContainer } from './container';
import { NextFunction, Request, Response } from 'express';
import { RouteInfo } from "./entities/routeInfo";
import { ParamType } from "./constants/enum";

/**
 * Bootstraps the whole application.
 * @param params Register all the controllers here and optionally provide a base route for all endpoints. 
 */
export function bootstrap(params: {base?: string, controllers: typeof BaseController[]}) {
    
    params.controllers.forEach(x => {
        const controllerName = x.name.replace('Controller', '').toLowerCase();
        const controllerInstance = new x();
        ControllersContainer.set(controllerName, controllerInstance);
    });
    const trimRegex = /(^\/)|(\/$)/g;
    params.base = params.base ? `/${params.base.replace(trimRegex, '')}` : '';

    return (req: Request, res: Response, next: NextFunction) => {

        let isRouteResolved = false;

        const url = req.url.replace(params.base!, '');
        const method = req.method;
        const controllerName = url.split('/')[1].split('?')[0];
        const queryParams = req.query;
        const requestBody = req.body;
        
        const controller = ControllersContainer.get(controllerName);
        
        if (controller) {
            const routes = <RouteInfo[]>(<any>controller).routes;
            
            const matchedRoute = routes.find(x => new RegExp(x.routeRegex).test(url)
                && x.httpMethod.toString() == method);
            if (matchedRoute && req.url.startsWith(params.base!)) {
                const routeParams =  getRouteParams(matchedRoute.route, matchedRoute.routeParamsIndices, url);
                
                let methodExecutionExpression = `controller.${matchedRoute.method}(`;
                matchedRoute.params.forEach((x, index) => {
                    switch (x.type) {
                        case ParamType.Body:
                            methodExecutionExpression += JSON.stringify(requestBody);
                            break;
                        case ParamType.Query:
                            methodExecutionExpression += JSON.stringify(queryParams);
                            break;
                        case ParamType.Route:
                            methodExecutionExpression += routeParams[x.name];
                            break;
                    }
                    if (index < matchedRoute.params.length-1) {
                        methodExecutionExpression += ',';
                    }
                });
                methodExecutionExpression += ')';
                const result = eval(methodExecutionExpression);
                res.status(200).send(result);
                isRouteResolved = true;
            } 
        }
        if (!isRouteResolved) {
            res.status(404).send('Not Found');
        }
    };
}
    
function getRouteParams(toMatch: string, routeParamsIndices: number[], toParse: string) {
    const toMatchSplit = toMatch.split('/');
    const toParseSplit = toParse.split('/');

    const routeParams: any = new Object();
    routeParamsIndices.forEach(index => {
        const queryParamsRegex = /[?].*/;
        routeParams[toMatchSplit[index].replace(':', '')] = 
            toParseSplit[index].replace(queryParamsRegex, '');
    });
    return routeParams;
}