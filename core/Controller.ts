import {Responses} from "./Responses";
import { Sauce } from "./Sauce";
import { ObjectOfAnything } from "./resources/Common";

/**
* Controllers are the brain of your routes. Every route must have a controller & a controller action. This is where your controller actions live for their respective route(s).
*
* File Naming Convention
*
* By default, Sauce expects a specific naming convention for your controllers. For example, let's say you created a route and specified a controller of example for a route of GET /some-route. When that route gets hit, Sauce will look in the configured controller directory (see Sauce Config) for a controller named example.controller.<CONFIGURED EXTENSION> (based on your configured file extension, again see Sauce Config)
* However you can override that naming convention by specify a specific controller with customControllerPath in your route (see Routes)
*/
export class Controller<custom=ObjectOfAnything> {
    /** A built in class of response handlers */
    protected responses :Responses;

    /** Automatically set from the Sauce Object. This is the Express request object. */
    protected req :Sauce["req"];

    /** Automatically set from the Sauce Object. This gives you access to the current route's configuration. */
    protected currentRoute :Sauce["currentRoute"];

    /** Automatically set from the Sauce Object. This is the Express response object. */
    protected res :Sauce["res"];

    /** Automatically set from the Sauce Object. This is the Express Next method. */
    protected next :Sauce["next"];

    /** Automatically set from the Sauce Object. This gives you access to the Sauce config object. */
    protected config :Sauce["config"];

    constructor(protected Sauce :Sauce<custom>) {
        this.req = Sauce.req;
        this.currentRoute = Sauce.currentRoute;
        this.res = Sauce.res;
        this.next = Sauce.next;
        this.config = Sauce.config;
        this.responses = new Responses(this.res);
    }
}
