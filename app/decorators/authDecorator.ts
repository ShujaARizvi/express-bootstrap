import { RouteAuthInfo } from "../entities/routeAuthInfo";
import { AuthResponse } from "../models/authResponse";

export const authRoutesPropertyName = 'authRoutes';

function checkAndInitializeAuthRoutes(target: any) {
    if (!target.hasOwnProperty(authRoutesPropertyName)) {
        Object.defineProperty(target, authRoutesPropertyName, {
            value: new Array<RouteAuthInfo>()
        });
    }
}

export function Auth(authCallback?: () => AuthResponse) {
    
    return (target: any, propertyKey: string) => {
        checkAndInitializeAuthRoutes(target);

        target[authRoutesPropertyName].push(new RouteAuthInfo(propertyKey, authCallback));
    }
}