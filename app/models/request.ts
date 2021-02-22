
export class Request {
    headers: any;
    query: any;
    body: any;

    constructor(headers: any, query: any, body: any) {
        this.headers = headers;
        this.query = query;
        this.body = body;
    }
}

