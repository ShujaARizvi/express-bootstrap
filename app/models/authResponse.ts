import { HTTPResponse } from "../constants/enum";

/**
 * Class representing response of authentication and authorization. 
 */
export class AuthResponse {

    /** A random prop to identify this class. */
    private d1fecb2634084eec8cda84f666d3f9c4: string;

    /** Is the call authenticated and authorized. */
    public isAuthenticatedAndAuthorized: boolean;
    /** If the auth failed, the optional message to return as API call response. */
    public authFailureMessage?: any;
    /** HTTP Statuscode. Possible values in case of failure - 401 Unauthorized | 403 Forbidden */
    public statusCode: HTTPResponse;

    constructor(isAuthNAuth: boolean, statusCode: HTTPResponse, authFailureMessage?: any) {
        this.d1fecb2634084eec8cda84f666d3f9c4 = 'd1fecb2634084eec8cda84f666d3f9c4';
        
        this.isAuthenticatedAndAuthorized = isAuthNAuth;
        this.statusCode = statusCode;
        this.authFailureMessage = authFailureMessage;
    }
}