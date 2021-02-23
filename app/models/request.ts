/**
 * Class wrapping headers, query, and body of an API Request.
 * Used for authentication and authorization purpose.
 */
export class Request {
    /** Headers in the API Request. */
    headers: any;
    /** Query parameters in the API Request. */
    query: any;
    /** Body/Payload of the API Request. */
    body: any;

    constructor(headers: any, query: any, body: any) {
        this.headers = headers;
        this.query = query;
        this.body = body;
    }
}

