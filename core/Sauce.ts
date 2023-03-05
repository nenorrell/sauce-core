import {Application, NextFunction, Response, Request} from "express";
import {SauceConfig} from "./resources/SauceConfig";
import {ObjectOfAnything} from "./resources/Common";
import {Route} from "./routes/Route";

export type Sauce<custom=ObjectOfAnything> = {
    req :Request;
    res :Response;
    next :NextFunction;
    app :Application;
    currentRoute :Route;
    config :SauceConfig;
    custom ?:custom
}
export const buildSauceObj = <custom=ObjectOfAnything>({req, res, next, app, currentRoute, config, custom}:Sauce<custom>) :Sauce<custom> => {
    let Sauce :Sauce<custom> = {
        req,
        res,
        next,
        app,
        currentRoute,
        config
    };
    if(custom) {
        Sauce = {
            ...Sauce,
            custom
        };
    }
    return Sauce;
};
