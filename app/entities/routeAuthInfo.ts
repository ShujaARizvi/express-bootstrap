export class RouteAuthInfo {
    method: string;
    callback?: () => boolean;
    
    constructor(method: string, callback?: () => boolean) {
        this.method = method;
        this.callback = callback;
    }
}