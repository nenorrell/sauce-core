import {Response} from "express";
import {ObjectOfAnything} from "./resources/Common";
import {IArrayResponse, IErrorResponse, IPaginatedResponse, IResponse} from "./resources/IResponses";
import {PaginatedObject} from "./resources/PaginationTypes";

export class Responses {
    private res :Response;
    constructor(res :Response) {
        this.res = res;
    }

    public responseText(code :200, data :string | number) :void {
        this.res.status(code).send(data);
    }

    public responseObject(code :200, data :ObjectOfAnything) :void {
        this.res.status(code).json(formatObjectResponse(200, data));
    }

    public responsePaginated(code :200, paginatedData :PaginatedObject) :void {
        this.res.status(code).json(formatPaginatedResponse(code, paginatedData));
    }

    public responseArray(code :200, data :Array<any>) :void {
        this.res.status(code).json(formatArrayResponse(code, data));
    }

    public badRequest(data :any, options ?:any) :void {
        const code = 400;
        this.res.status(code).json(formatErrorResponse(code, "Bad Request", data));
    }

    public serverError(data :any, options ?:any) :void {
        const code = 500;
        this.res.status(code).json(formatErrorResponse(code, "Internal Server Error", data));
    }

    public notFound(data :any, options ?:any) :void {
        const code = 404;
        this.res.status(code).json(formatErrorResponse(code, "Not Found", data));
    }

    public unauthorized(data :any, options ?:any) :void {
        const code = 401;
        this.res.status(code).json(formatErrorResponse(code, "Unauthorized", data));
    }
}

export const formatObjectResponse = (code :number, data :ObjectOfAnything) :IResponse =>{
    return {
        response: data,
        code
    };
};

export const formatPaginatedResponse = (code :number, paginatedData :PaginatedObject) :IPaginatedResponse =>{
    return {
        response: paginatedData.data,
        page: paginatedData.page,
        code
    };
};

export const formatArrayResponse = (code :number, data :Array<any>) :IArrayResponse =>{
    return {
        response: data,
        code
    };
};

export const formatErrorResponse = (code :number, error :string, errorDescription ?:any) :IErrorResponse =>{
    return {
        response: {},
        code,
        error,
        error_description: errorDescription || ""
    };
};
