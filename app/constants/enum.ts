export enum HTTPMethod {
    Get = 'GET',
    Post = 'POST',
    Put = 'PUT',
    Patch = 'PATCH',
    Delete = 'DELETE'
}

export enum HTTPResponse {

    Success = 200,
    Created = 201,
    NoContent = 204,

    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    MethodNotAllowed = 405,
    UnprocessableEntity = 422
}

export enum ParamType {
    Route,
    Body,
    Query
}
