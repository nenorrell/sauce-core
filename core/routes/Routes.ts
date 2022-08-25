import {Route} from "./Route";
import {asyncForEach, cleanObject} from "../utility";
import {ApolloConfig} from "../resources/ApolloConfig";
import { log } from "../Logger";
import { yellow } from "chalk";
import { Application, NextFunction, Request, Response } from "express";
import { Apollo, buildApolloObj } from "../Apollo";
import { Controller } from "../Controller";
import { ObjectOfAnything } from "../resources/Common";
import { setPolicies } from "./Policies";
import { RouteValidator } from "./RouteValidator";
import { FormattedRoute, FormattedRouteParam, RouteGrouping } from "../@types/Routes.types";

interface BindRoutesArgs<custom> {
    app :Application
    apolloCustom :Apollo<custom>["custom"]
}

/**
 * Manages the application's route configurations.
 *
 * @property {Array} routesArray -
 * It's strongly recommended to utilize the RouteDefinitions
 * file to manage your defined routes. This will make your
 * configured routes far more manageable and readable
 */
export class Routes {
    public routesArray :Route[];

    constructor(private config :ApolloConfig) {
        this.routesArray = config.routes;
    }

    public async getFormattedRoutes(stripHidden ?:boolean) :Promise<(FormattedRoute|RouteGrouping)[]> {
        const formatted = await this.formatRoutes(this.routesArray, stripHidden);
        return this.sortRoutes(this.processRoutes(formatted));
    }

    public processRoutes(routeGroups :(FormattedRoute|RouteGrouping)[]) {
        return routeGroups.map((group)=>{
            if((group as RouteGrouping).tag) { // Is a group of routes
                this.sortRoutes((group as RouteGrouping).routes);
            }
            return group; // Is a route obj
        });
    }

    public sortRoutes(routes :(FormattedRoute|RouteGrouping)[]) :(FormattedRoute|RouteGrouping)[] {
        return routes.sort((a :FormattedRoute, b:FormattedRoute)=>{
            const route1 = a.path ? a.path.replace(/[.-]/, "") : "";
            const route2 = b.path ? b.path.replace(/[.-]/, "") : "";
            return route1>route2 ? 1 : -1;
        });
    }

    public sortRouteGroups(routes :RouteGrouping[]) :RouteGrouping[] {
        return routes.sort((a, b)=>{
            return a.tag<b.tag ? 1 : -1;
        });
    }

    private async formatRoutes(routes :Route[], stripHidden ?:boolean) :Promise<(FormattedRoute|RouteGrouping)[]> {
        const groupedRoutes :Map<string, any[]> = new Map();
        const ungroupedRoutes :FormattedRoute[] = [];

        await asyncForEach(routes, async (route)=>{
            if(!(stripHidden && route.hidden)) {
                const formattedObj :FormattedRoute = {
                    method: route.method.toString(),
                    path: route.path,
                    controller: route.controller,
                    action: route.action.toString(),
                    policies: route.policies,
                    description: route.description,
                    isDeprecated: route.isDeprecated,
                    pathParams: route.getFormattedPathParams(),
                    queryParams: route.getFormattedQueryParams(),
                    bodySchema: route.getFormattedBodySchema(),
                    exampleResponse: route.exampleResponse
                };
                if(formattedObj.pathParams) {
                    this.cleanRouteParams(formattedObj.pathParams);
                }
                if(formattedObj.queryParams) {
                    this.cleanRouteParams(formattedObj.queryParams);
                }
                if(formattedObj.bodySchema) {
                    cleanObject(formattedObj.bodySchema);
                }
                cleanObject(formattedObj);

                if(typeof route.tag !== "undefined") {
                    const tag = route.tag;
                    if(groupedRoutes.has(tag)) {
                        const group = groupedRoutes.get(tag);
                        group.push(formattedObj);
                        groupedRoutes.set(tag, group);
                    }
                    else{
                        groupedRoutes.set(tag, [formattedObj]);
                    }
                }
                else{
                    ungroupedRoutes.push(formattedObj);
                }
            }
        });
        const groupedRoutesArray :RouteGrouping[] = Array.from(groupedRoutes, ([tag, routes]) => ({tag, routes}));
        return [...ungroupedRoutes, ...this.sortRouteGroups(groupedRoutesArray)];
    }

    private async cleanRouteParams(params :FormattedRouteParam[]) :Promise<void> {
        await asyncForEach(params, param =>cleanObject(param));
    }

    private getControllerClass(route :Route) :Controller {
        let controller :Controller;
        const extension = this.config.controllerExtension || "ts";

        if(route.customControllerPath) {
            controller = require(`${this.config.controllerDirectory}/${route.customControllerPath}`);
        }
        else{
            controller = require(`${this.config.controllerDirectory}/${route.controller}/${route.controller}.controller.${extension}`);
        }
        return controller;
    }

    /** This should only run on startup so it's fine that it's not async */
    public bindRoutes<custom=ObjectOfAnything>({app, apolloCustom}:BindRoutesArgs<custom>) :void {
        this.routesArray.forEach(route =>{
            try{
                if(route.excludedEnvironments && route.excludedEnvironments.includes(process.env.ENV)) {
                    log(this.config, "info", yellow(`Excluding ${route.path} for this environment`));
                }
                else {
                    const policyList = setPolicies<custom>(this.config.policies);

                    log(this.config, "debug", `Binding ${route.path}`);
                    app[route.method](route.path, async (req :Request, res :Response, next :NextFunction)=>{
                        /**
                         * BEWARE, anything inside this block is inside of the
                         * request itself. Avoid non async logic from here on
                        */
                        try{
                            let controller = this.getControllerClass(route);
                            const apollo :Apollo<custom> = buildApolloObj({
                                config: this.config,
                                req,
                                res,
                                next,
                                app,
                                currentRoute: route,
                                custom: apolloCustom
                            });

                            const controllerClassName = Object.keys(controller)[0];
                            controller = new controller[controllerClassName](apollo);

                            const routeValidator = new RouteValidator(apollo);
                            await routeValidator.runValidations();
                            await routeValidator.checkPolicies(policyList);

                            controller[route.action](req, res, next);
                        }
                        catch(e) {
                            next(e);
                        }
                    });
                }
            }
            catch(e) {
                log(this.config, "error", "FAILED BINDING ROUTE: ", e);
                throw e;
            }
        });
    }
}
