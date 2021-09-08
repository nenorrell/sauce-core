import { Application, NextFunction, Response, Request } from "express";
import { ApolloConfig } from "./resources/ApolloConfig";
import { ObjectOfAnything } from "./resources/Common";
import { Route } from "./routes/Route";

export type ApolloType = {
    req :Request;
    res :Response;
    next :NextFunction;
    app :Application;
    currentRoute :Route;
    config :ApolloConfig;
};

export let Apollo :ApolloType;

type ApolloBuild <T> = ApolloType & {custom ?:T} 
export const buildApolloObj = <T=ObjectOfAnything>({req, res, next, app, currentRoute, config, custom}:ApolloBuild<T>) :void => {
    Apollo = {
        req,
        res,
        next,
        app,
        currentRoute,
        config
    }
    if(custom){
        Apollo = {
            ...Apollo,
            ...custom
        }
    }
}

export const getApollo = <Extension=ObjectOfAnything>() :ApolloType & Extension=>{
    return Apollo as any;
}