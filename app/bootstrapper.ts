import { BaseController } from "./controllers/baseController";
import { ControllersContainer } from './container';
import { NextFunction, Request, Response } from 'express';
import { RouteInfo } from "./entities/routeInfo";
import { UsersController } from "./controllers/usersController";

/**
 * Boostraps the whole application.
 * @param controllers Register all the controllers here. 
 */
export function bootstrap(controllers: typeof BaseController[]) {
    
    controllers.forEach(x => {
        const controllerName = x.name.replace('Controller', '').toLowerCase();
        const controllerInstance = new x();
        ControllersContainer.set(controllerName, controllerInstance);
    });

    return (req: Request, res: Response, next: NextFunction) => {

        const url = req.url;
        const controllerName = url.split('/')[2];
        const queryParams = req.query;
        const requestBody = req.body;
        
        const controller = ControllersContainer.get(controllerName);
        const routes = <RouteInfo[]>(<any>controller).routes;
        
        const matchedRoute = routes.find(x => {
            return new RegExp(x.routeRegex).test(url);
        });
        if (matchedRoute) {
            const routeParams =  getRouteParams(matchedRoute.route, matchedRoute.routeParamsIndices, url);
            
            let methodExecutionExpression = `controller.${matchedRoute.method}(`;

            matchedRoute.params.forEach((x, index) => {
                methodExecutionExpression += routeParams[x.name];
                if (index < matchedRoute.params.length-1) {
                    methodExecutionExpression += ',';
                }
            })
            methodExecutionExpression += ')';
            const result = eval(methodExecutionExpression);
            res.status(200).send(result);
        } else {
            res.status(404).send('Not Found');
        }
    };
}

const getRouteParams = (toMatch: string, routeParamsIndices: number[], toParse: string) => {
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