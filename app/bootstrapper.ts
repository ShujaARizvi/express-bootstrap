import { NextFunction, Request as ERequest, Response } from 'express';
import Joi from "joi";

import { ControllersContainer } from './container';
import { RouteInfo } from "./entities/routeInfo";
import { HTTPResponse, ParamType } from "./constants/enum";
import { deserialize } from "./helpers/json";
import { baseControllerClassIdentifier, responseClassIdentifier, validationSchemaPropertyName } from "./constants/constants";
import { authRoutesPropertyName, controllerLevelAuthPropertyName, noAuthRoutesPropertyName } from './decorators/authDecorator';
import { RouteAuthInfo } from "./entities/routeAuthInfo";
import { AuthResponse } from "./models/authResponse";
import { Request } from './models/request';
import { Endpoint } from './models/endpoint';
import { Lifetime } from 'awilix';
import { BaseController } from './controllers/baseController';

/**
 * Bootstraps the whole application.
 * @param params Params to assist with the bootstrapping process.
 */
export function bootstrap(params: {
    /**
     * The base route for all endpoints - for example: /api/v1
     */
    base?: string,
    /**
     * List of controllers to be used throughout the application.
     */
    controllers: any[],
    /**
     * Method to call while performing authentication and authorization on different routes. 
     */
    authCallback?: (req: Request, endpoint: Endpoint) => AuthResponse
}) {
    
    // Performing validations on the input controller array.
    // validateControllers(params.controllers);

    params.controllers.forEach(x => {
        const controllerName = x.name.replace('Controller', '');
        ControllersContainer.set(controllerName.toLowerCase(), x, Lifetime.SINGLETON);
    });
    const trimRegex = /(^\/)|(\/$)/g;
    params.base = params.base ? `/${params.base.replace(trimRegex, '')}` : '';

    return (req: ERequest, res: Response, next: NextFunction) => {

        let isRouteResolved = false;
        let validationErrorOccurred = false;

        const url = req.url.replace(params.base!, '');
        const method = req.method;
        const controllerName = url.split('/')[1].split('?')[0];
        const queryParams = req.query;
        const requestBody = req.body;
        
        const controller: any = ControllersContainer.get(controllerName);
        controller.name = controllerName;
        
        if (controller) {
            const routes = <RouteInfo[]>(<any>controller).routes;
            
            const matchedRoute = routes.find(x => new RegExp(x.routeRegex).test(url)
                && x.httpMethod.toString() === method);
            if (matchedRoute && req.url.startsWith(params.base!)) {
                
                // Initially, verify if the route has AuthNAuth enabled.
                // If so, call the appropriate AuthNAuth handler.
                let authResponse = new AuthResponse(true, HTTPResponse.Success);

                // Fetching auth info for all routes within the target controller.
                const authRoutes = <Array<RouteAuthInfo>>controller[authRoutesPropertyName];
                // Fetching no auth info for all routes within the target controller.
                const noAuthRoutes = <Array<RouteAuthInfo>>controller[noAuthRoutesPropertyName];
                // Fetching auth info for the controller itself.
                const controllerAuth = controller[controllerLevelAuthPropertyName];
                
                if (authRoutes) {
                    // Find the auth info for the target route/method.
                    const targetRouteAuthInfo = authRoutes.find(x => x.method === matchedRoute.method);
                    
                    if (targetRouteAuthInfo) {
                        // If callback is assigned to the auth info, use it, otherwise use the one provided in this method if present.
                        const targetCallback = targetRouteAuthInfo.callback ? targetRouteAuthInfo.callback : 
                        controllerAuth && controllerAuth.callback ? controllerAuth.callback : params.authCallback;
                        authResponse = determineAuthResponse(req, matchedRoute, controllerName, targetCallback);
                    // Since an @Auth decorator is not found on our target method, perhaps the whole controller is under Auth.
                    } else if (controllerAuth) {
                        // The whole controller is under Auth. Now we need to check whether our method is excluded from Auth.
                        // Find the no auth info for the target route/method.
                        let targetRouteNoAuthInfo;
                        if (noAuthRoutes) {
                            targetRouteNoAuthInfo = noAuthRoutes.find(x => x.method === matchedRoute.method);
                        }
                    
                        // Since our method is not found within NoAuth routes, we can proceed with the auth callback.
                        if (!targetRouteNoAuthInfo) {
                            const targetCallback = controllerAuth.callback ? controllerAuth.callback : params.authCallback;
                            authResponse = determineAuthResponse(req, matchedRoute, controllerName, targetCallback);
                        }
                    }
                // Since an @Auth decorator is not found on any of the target controller's methods, perhaps the whole controller is under Auth.
                } else if (controllerAuth) {
                    // The whole controller is under Auth. Now we need to check whether our method is excluded from Auth.
                    // Find the no auth info for the target route/method.
                    let targetRouteNoAuthInfo;
                    if (noAuthRoutes) {
                        targetRouteNoAuthInfo = noAuthRoutes.find(x => x.method === matchedRoute.method);
                    }
                    
                    // Since our method is not found within NoAuth routes, we can proceed with the auth callback.
                    if (!targetRouteNoAuthInfo) {
                        const targetCallback = controllerAuth.callback ? controllerAuth.callback : params.authCallback;
                        authResponse = determineAuthResponse(req, matchedRoute, controllerName, targetCallback);
                    }
                }

                if (!authResponse.isAuthenticatedAndAuthorized) {
                    return res.status(authResponse.statusCode).send(authResponse.authFailureMessage);
                }
                
                const routeParams =  getRouteParams(matchedRoute.route, matchedRoute.routeParamsIndices, url);
                let methodExecutionExpression = `${Object.keys({controller})[0]}.${matchedRoute.method}(`;
                let modelParams = new Array();
                const paramsArrayVarName = Object.keys({modelParams})[0];

                matchedRoute.params.forEach((x, index) => {
                    let validationError;
                    switch (x.paramType) {
                        case ParamType.Body:
                            validationError = performInputValidation(x.model, requestBody);
                            if (validationError) {
                                res.status(HTTPResponse.UnprocessableEntity).send(validationError);
                                validationErrorOccurred = true;
                            } else {
                                modelParams.push(deserialize(requestBody, x.model));
                                methodExecutionExpression += `${paramsArrayVarName}[${modelParams.length - 1}]`;
                            }
                            break;
                        case ParamType.Query:
                            validationError = performInputValidation(x.model, queryParams);
                            if (validationError) {
                                res.status(HTTPResponse.UnprocessableEntity).send(validationError);
                                validationErrorOccurred = true;
                            } else {
                                modelParams.push(deserialize(queryParams, x.model));
                                methodExecutionExpression += `${paramsArrayVarName}[${modelParams.length - 1}]`;
                            }
                            break;
                        case ParamType.Route:
                            methodExecutionExpression += isNaN(routeParams[x.name]) ? 
                                `'${decodeURIComponent(routeParams[x.name])}'` : routeParams[x.name];
                            break;
                    }
                    if (index < matchedRoute.params.length - 1) {
                        methodExecutionExpression += ',';
                    }
                });
                methodExecutionExpression += ')';
                if (!validationErrorOccurred) {
                    const result = eval(methodExecutionExpression);
                    // Check if result has the custom 'Response' type.
                    if (result[responseClassIdentifier]) {
                        res.status(result.statusCode).send(result.data);
                    } else {
                        res.status(200).send(result);
                    }
                }
                isRouteResolved = true;
            } 
        }
        if (!isRouteResolved) {
            res.status(404).send('Not Found');
        }
    };
}

function validateControllers(controllers: any[]) {
    controllers.forEach(x => {
        if (!(x instanceof BaseController)) {
            throw new Error(`Controller ${x.constructor.name} doesn't extend BaseController`);
        }
    });
}

function determineAuthResponse(req: Request, matchedRoute: RouteInfo, controllerName: string, 
    targetCallback?: (req: Request, endpoint: Endpoint) => AuthResponse): AuthResponse {
    
    let authResponse = new AuthResponse(true, HTTPResponse.Success);
    if (targetCallback) {
        const request = new Request(req.headers, req.query, req.body);
        const endpoint = new Endpoint(matchedRoute.route, controllerName, matchedRoute.method, matchedRoute.httpMethod);
        authResponse = targetCallback(request, endpoint);
    }
    return authResponse;
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

function performInputValidation(model: any, input: any) {
    
    let validationErrorDetails;

    const obj = new model();
    if (obj[validationSchemaPropertyName]) {
        const validationError = Joi.object(obj[validationSchemaPropertyName]).validate(input).error;
        if (validationError) {
            validationErrorDetails = validationError.details;
        }
    }

    return validationErrorDetails;
}