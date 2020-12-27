import { HTTPResponse } from "../constants/enum";

export class Response {

    /** A random prop to identify this class. */
    private dc742354452247d0b7b45fc6807e322e: string;

    public statusCode: HTTPResponse;
    public data: any;

    constructor(statusCode: HTTPResponse, data: any) {
        this.dc742354452247d0b7b45fc6807e322e = 'dc742354452247d0b7b45fc6807e322e';
        this.statusCode = statusCode;
        this.data = data;
    }
}