import { policyMethod } from "../routes/Policies";
import {Route} from "../routes/Route";
import {PaginationConfig} from "./PaginationTypes";

type PolicyFunctions = {
    [key :string] :policyMethod
};

type Policies<T> = {
    [key in keyof T] :policyMethod // eslint-disable-line no-unused-vars
};

export interface ApolloConfig<PolicyOptions=PolicyFunctions> {
    environments :Record<string, {url :string}>

    /** Your app routes */
    routes :Route[]

    /** The directory of your controller methods */
    controllerDirectory :string,

    /** Route policy definitions */
    policies ?:Policies<PolicyOptions>

    /** Customize Apollo's built in config */
    pagination ?:PaginationConfig

    /** Disable Apollo logs */
    disableLogs ?:boolean

    /** Pass your logger to Apollo */
    logger ?:{
        debug ?:Function
        info ?:Function
        warn ?:Function
        error ?:Function
    }
}
