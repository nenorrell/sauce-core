import { policyMethod } from "../routes/Policies";
import {Route} from "../routes/Route";
import { ObjectOfAnything } from "./Common";
import {PaginationConfig} from "./PaginationTypes";

type PolicyFunctions<custom> = {
    [key :string] :policyMethod<custom>
};

type Policies<T, custom> = {
    [key in keyof T] :policyMethod<custom> // eslint-disable-line no-unused-vars
};

export interface SauceConfig<custom=ObjectOfAnything, PolicyOptions=PolicyFunctions<custom>> {
    environments :Record<string, {url :string}>

    /** Your app routes */
    routes :Route[]

    /** The directory of your controller methods */
    controllerDirectory :string,

    /** Route policy definitions */
    policies ?:Policies<PolicyOptions, custom>

    /** Customize Sauce's built in config */
    pagination ?:PaginationConfig

    /** Tell Sauce what file type your controllers are.
     *  @default "ts"
    */
    controllerExtension ?:string

    /** Disable Sauce logs */
    disableLogs ?:boolean

    /** Pass your logger to Sauce */
    logger ?:{
        debug ?:Function
        info ?:Function
        warn ?:Function
        error ?:Function
    }
}
