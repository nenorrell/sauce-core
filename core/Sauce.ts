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

/**
 * A utility function for building a Sauce object from its constituent parts.
 *
 * @template custom - an optional type parameter representing any custom properties that may be added to the Sauce object
 *
 * @param {Object} options - an options object containing the following properties:
 * @param {Request} options.req - the incoming request object
 * @param {Response} options.res - the outgoing response object
 * @param {NextFunction} options.next - a function that calls the next middleware function in the stack
 * @param {Application} options.app - the Express application object
 * @param {Route} options.currentRoute - the current route object
 * @param {SauceConfig} options.config - the Sauce configuration object
 * @param {custom} [options.custom] - an optional custom property that may be added to the Sauce object
 *
 * @return {Sauce<custom>} a Sauce object built from the provided options
 */
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
