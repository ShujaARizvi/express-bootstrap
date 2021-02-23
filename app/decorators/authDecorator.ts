import { RouteAuthInfo } from "../entities/routeAuthInfo";
import { AuthResponse } from "../models/authResponse";
import { Endpoint } from "../models/endpoint";
import { Request } from "../models/request";
import { ControllerAuthInfo } from '../entities/controllerAuthInfo';

export const authRoutesPropertyName = 'authRoutes';
export const noAuthRoutesPropertyName = 'noAuthRoutes';
export const controllerLevelAuthPropertyName = 'controllerAuth';

function checkAndInitializeAuthRoutes(target: any) {
    if (!target.hasOwnProperty(authRoutesPropertyName)) {
        Object.defineProperty(target, authRoutesPropertyName, {
            value: new Array<RouteAuthInfo>()
        });
    }
}

function checkAndInitializeNoAuthRoutes(target: any) {
    if (!target.hasOwnProperty(noAuthRoutesPropertyName)) {
        Object.defineProperty(target, noAuthRoutesPropertyName, {
            value: new Array<RouteAuthInfo>()
        });
    }
}

/**
 * Specifies that a controller method is to be authenticated and authorized.
 * @param authCallback Method to call while performing authentication and authorization on this route. 
 * This callback is optional and if not provided, the callback provided in the `@ControllerAuth` decorator (if used) will be used,
 * otherwise, `bootstrap` function's callback will be used.
 */
export function Auth(authCallback?: (req: Request, endpoint: Endpoint) => AuthResponse) {
    
    return (target: any, propertyKey: string) => {
        checkAndInitializeAuthRoutes(target);

        const methodRegisteredForNoAuth = target[noAuthRoutesPropertyName] ? (<Array<RouteAuthInfo>>target[noAuthRoutesPropertyName]).find(r => r.method === propertyKey) : undefined;
        if (methodRegisteredForNoAuth) {
            throw new Error(`The method ${propertyKey} is already marked with @NoAuth. Usage of @Auth and @NoAuth decorators is mutually exclusive.`);
        }
        target[authRoutesPropertyName].push(new RouteAuthInfo(propertyKey, authCallback));
    }
}

/**
 * Specifies that a controller method is excluded from authentication and authorization.
 * Useful when the controller is marked with `@ControllerAuth` decorator.
 */
export function NoAuth() {
    
    return (target: any, propertyKey: string) => {
        checkAndInitializeNoAuthRoutes(target);
        
        const methodRegisteredForAuth = target[authRoutesPropertyName] ? (<Array<RouteAuthInfo>>target[authRoutesPropertyName]).find(r => r.method === propertyKey) : undefined;
        if (methodRegisteredForAuth) {
            throw new Error(`The method ${propertyKey} is already marked with @Auth. Usage of @Auth and @NoAuth decorators is mutually exclusive.`);
        }
        target[noAuthRoutesPropertyName].push(new RouteAuthInfo(propertyKey));
    }
}

/**
 * Specifies that all the routes/method of a controller are to be authenticated and authorized.
 * @param authCallback Method to call while performing authentication and authorization on the routes of this method. 
 * This callback is optional and if not provided, the callback provided in `bootstrap` function will be used.
 */
export function ControllerAuth(authCallback?: (req: Request, endpoint: Endpoint) => AuthResponse) {
    
    return <T extends new (...args: any[]) => {}>(constructor: T) => {
        (<any>constructor.prototype).controllerAuth = new ControllerAuthInfo(authCallback);
        return constructor;
    }
}

// export function ControllerAuth(authCallback?: (req: Request, endpoint: Endpoint) => AuthResponse) {
//     console.log('Called ControllerAuth');
//     return (target: any) => {
//         console.log('Called ControllerAuth Callback');
//         if (!target.hasOwnProperty(controllerLevelAuthPropertyName)) {
//             console.log(`${controllerLevelAuthPropertyName} property not defined`);
//             // Object.defineProperty(target, controllerLevelAuthPropertyName, {
//             //     value: new ControllerAuthInfo(authCallback)
//             // });
//             target[controllerLevelAuthPropertyName] = new ControllerAuthInfo(authCallback);
//             const json = JSON.stringify(target[controllerLevelAuthPropertyName]);
//             console.log(`Defined property ${controllerLevelAuthPropertyName}. Value: ${json}`);
//         }
//     }
// }