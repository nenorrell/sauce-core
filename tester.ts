import { ApolloConfig } from "./core";
import { Route } from "./core/routes/Route";

const root :Route = new Route()
.setMethod("GET")
.setPath("/")
.setController("root")
.setAction("index")
.setDescription("Check to see if the API is running");

const  version :Route = new Route()
.setMethod("GET")
.setPath("/version")
.setController("version")
.setAction("getVersion")
.setDescription("This endpoint will display the version of the API being used")
.setPolicies<keyof PolicyOptions>(["authenticated", "isAdmin"])
.setTag<RouteTags>("Authentication")

const baseRoutes :Array<Route> = [
    root,
    version
];

interface PolicyOptions{
    authenticated: ()=>{},
    isAdmin: ()=>{}
}

type RouteTags = "Admin" | "Authentication";

const config :ApolloConfig<PolicyOptions> = {
    routes: baseRoutes,
    policies: {
        authenticated: ()=>{},
        isAdmin :()=>{}
    },
    environments: {
        local: {
            url: "http://localhost:3035"
        },
        qa: {
            url: "https://qa.somewhere.com"
        },
        prod: {
            url: "https://somewhere.com"
        }
    },
    pagination: {
        pageSize: 25,
        max: 50
    }
}