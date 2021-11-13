import {ObjectOfAnything} from "./Common";
import {PaginatedObject} from "./PaginationTypes";

export type ApolloResponseType = IPaginatedResponse | IResponse | IArrayResponse | IErrorResponse;

interface ICommonResponse{
    code :number
}

export interface IPaginatedResponse extends ICommonResponse{
    response :PaginatedObject["data"],
    page :PaginatedObject["page"],
}

export interface IResponse extends ICommonResponse{
    response :ObjectOfAnything
}

export interface IArrayResponse extends ICommonResponse{
    response :Array<any>
}

export interface IErrorResponse extends ICommonResponse{
    response :any,
    error :string,
    error_description :any // eslint-disable-line camelcase
}
