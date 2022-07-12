import {Responses} from "./Responses";
import { Apollo } from "./Apollo";
import { ObjectOfAnything } from "./resources/Common";

export class Controller<custom=ObjectOfAnything> {
    protected responses :Responses;
    protected req :Apollo["req"];
    protected currentRoute :Apollo["currentRoute"];
    protected res :Apollo["res"];
    protected next :Apollo["next"];
    protected route :Apollo["currentRoute"];
    protected config :Apollo["config"];

    constructor(protected Apollo :Apollo<custom>) {
        this.req = Apollo.req;
        this.currentRoute = Apollo.currentRoute;
        this.res = Apollo.res;
        this.next = Apollo.next;
        this.route = Apollo.currentRoute;
        this.config = Apollo.config;
        this.responses = new Responses(this.res);
    }
}
