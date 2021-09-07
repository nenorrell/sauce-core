import { RouteParam, ParamDataTypes } from "../../core/routes/RouteParam";
import { Route } from "../../core/routes/Route";

interface IMockParam{
    name ?:string
    type ?: ParamDataTypes
    isRequired ?:boolean
    enumValues ?:Array<string | number | boolean>
}

export const mockRouteWithPathParams = (config :IMockParam[]) :Route =>{
    return new Route()
    .setMethod("GET")
    .setPathParams(mockRouteParams(config));
}

export const mockRouteWithQueryParams = (config :IMockParam[]) :Route =>{
    return new Route()
    .setMethod("GET")
    .setQueryParams(mockRouteParams(config));
}

export const mockRouteWithBodyParams = (params :RouteParam[]) :Route =>{
    return new Route()
    .setMethod("POST")
    .setBodySchema(params);
}

export const mockRouteParams = (config) :RouteParam[] =>{
    return config.map((param)=> mockRouteParam(param));
}

export const mockRouteParam = ({name,type,isRequired,enumValues}:IMockParam) :RouteParam =>{
    let param = new RouteParam()
    .setName(name || "someParam")
    .setType(type !== undefined ? type : "string")
    .setRequired(isRequired || false);
    if(enumValues){
        param.setEnumValues(enumValues);
    }
    return param;
}