import {Route} from './Route';
import { RouteParam } from './RouteParam';
import { asyncForEach, cleanObject } from '../utility';
import { ApolloConfig } from '..';

/**
 * @class Manages the application's route configurations.
 * 
 * @property {Array} routesArray - 
 * It's strongly recommended to utilize the RouteDefinitions
 * file to manage your defined routes. This will make your
 * configured routes far more manageable and readable
 */

 export class Routes{
    public routesArray :Route[];

    constructor(private config :ApolloConfig){
        this.routesArray = config.routes;
    }

    public async getFormattedRoutes() :Promise<any[]>{
        let formatted = await this.formatRoutes(this.routesArray);
        return this.sortRoutes(this.processRoutes(formatted));
    }
    
    public processRoutes(routes :Array<any>) :Array<any>{
        return routes.map((route)=>{
            if(route.tag){ // Is a group of routes
                this.sortRoutes(route.routes);
            }
            return route; // Is a route obj
        });
    }

    public sortRoutes(routes) :Array<Route>{
        return routes.sort((a,b)=>{
            let route1 = a.path ? a.path.replace(/[.-]/, '') : '';
            let route2 = b.path ? b.path.replace(/[.-]/, '') : '';
            return route1>route2 ? 1 : -1;
        });
    }

    public sortRouteGroups(routes) :Array<any>{
        return routes.sort((a,b)=>{
            return a.tag<b.tag ? 1 : -1;
        });
    }

    public async formatRoutes(routes :Array<Route>) :Promise<any[]>{
        let groupedRoutes :Map<string, Array<any>> = new Map();
        let ungroupedRoutes :Array<any> = [];
        
        await asyncForEach(routes, async (route)=>{
            let formattedObj = {
                method: route.method,
                path: route.path,
                controller: route.controller,
                action: route.action,
                policies: route.policies,
                description: route.description,
                pathParams: route.getFormattedPathParams(),
                queryParams: route.getFormattedQueryParams(),
                bodySchema: route.getFormattedBodySchema()
            }
            if(formattedObj.pathParams){
                this.cleanRouteParams(formattedObj.pathParams)
            }
            if(formattedObj.queryParams){
                this.cleanRouteParams(formattedObj.queryParams)
            }
            if(formattedObj.bodySchema){
                cleanObject(formattedObj.bodySchema)
            }
            cleanObject(formattedObj);

            if(typeof route.tag !== "undefined"){
                const tag = route.tag;
                if(groupedRoutes.has(tag)){
                    const group = groupedRoutes.get(tag);
                    group.push(formattedObj)
                    groupedRoutes.set(tag, group);
                }
                else{
                    groupedRoutes.set(tag, [formattedObj]);
                }
            }
            else{
                ungroupedRoutes.push(formattedObj);
            }
        });
        const groupedRoutesArray = Array.from(groupedRoutes, ([tag, routes]) => ({ tag, routes }));
        return [...ungroupedRoutes, ...this.sortRouteGroups(groupedRoutesArray)];
    }

    private async cleanRouteParams(params :RouteParam[]) :Promise<void>{
        await asyncForEach(params, param =>cleanObject(param))
    }
}