import { BaseController } from "./controllers/baseController";
import { ControllersContainer } from './container';
import { NextFunction, Request, Response } from 'express';
import { RouteInfo } from "./entities/routeInfo";
import { HTTPResponse, ParamType } from "./constants/enum";
import { deserialize } from "./helpers/json";
import Joi, { object, ValidationError } from "joi";
import { responseClassIdentifier, validationSchemaPropertyName } from "./constants/constants";

/**
 * Bootstraps the whole application.
 * @param params Register all the controllers here and optionally provide a base route for all endpoints. 
 */
export function bootstrap(params: {
    /**
     * The base route for all endpoints - for example: /api/v1
     */
    base?: string,
    /**
     * List of controllers to be used throughout the application.
     */
    controllers: typeof BaseController[]}) {
    
    params.controllers.forEach(x => {
        const controllerName = x.name.replace('Controller', '').toLowerCase();
        const controllerInstance = new x();
        ControllersContainer.set(controllerName, controllerInstance);
    });
    const trimRegex = /(^\/)|(\/$)/g;
    params.base = params.base ? `/${params.base.replace(trimRegex, '')}` : '';

    return (req: Request, res: Response, next: NextFunction) => {

        let isRouteResolved = false;
        let validationErrorOccurred = false;

        const url = req.url.replace(params.base!, '');
        const method = req.method;
        const controllerName = url.split('/')[1].split('?')[0];
        const queryParams = req.query;
        const requestBody = req.body;
        
        const controller = ControllersContainer.get(controllerName);
        
        if (controller) {
            const routes = <RouteInfo[]>(<any>controller).routes;
            
            const matchedRoute = routes.find(x => new RegExp(x.routeRegex).test(url)
                && x.httpMethod.toString() === method);
            if (matchedRoute && req.url.startsWith(params.base!)) {
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