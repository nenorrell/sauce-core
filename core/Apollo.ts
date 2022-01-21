import {Application, NextFunction, Response, Request} from "express";
import {ApolloConfig} from "./resources/ApolloConfig";
import {ObjectOfAnything} from "./resources/Common";
import {Route} from "./routes/Route";

export type Apollo<custom=ObjectOfAnything> = {
    req :Request;
    res :Response;
    next :NextFunction;
    app :Application;
    currentRoute :Route;
    config :ApolloConfig;
    custom ?:custom
}
export const buildApolloObj = <custom=ObjectOfAnything>({req, res, next, app, currentRoute, config, custom}:Apollo<custom>) :Apollo<custom> => {
    let Apollo :Apollo<custom> = {
        req,
        res,
        next,
        app,
        currentRoute,
        config
    };
    if(custom) {
        Apollo = {
            ...Apollo,
            custom
        };
    }
    return Apollo;
};
