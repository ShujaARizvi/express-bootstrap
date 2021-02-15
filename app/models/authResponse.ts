import { HTTPResponse } from "../constants/enum";

export class AuthResponse {

    /** A random prop to identify this class. */
    private d1fecb2634084eec8cda84f666d3f9c4: string;

    public isAuthenticatedAndAuthorized: boolean;
    public authFailureMessage?: any;
    public statusCode: HTTPResponse;

    constructor(isAuthNAuth: boolean, statusCode: HTTPResponse, authFailureMessage?: any) {
        this.d1fecb2634084eec8cda84f666d3f9c4 = 'd1fecb2634084eec8cda84f666d3f9c4';
        
        this.isAuthenticatedAndAuthorized = isAuthNAuth;
        this.statusCode = statusCode;
        this.authFailureMessage = authFailureMessage;
    }
}