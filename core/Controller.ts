import {Responses} from "./Responses";
import { Sauce } from "./Sauce";
import { ObjectOfAnything } from "./resources/Common";

export class Controller<custom=ObjectOfAnything> {
    protected responses :Responses;
    protected req :Sauce["req"];
    protected currentRoute :Sauce["currentRoute"];
    protected res :Sauce["res"];
    protected next :Sauce["next"];
    protected route :Sauce["currentRoute"];
    protected config :Sauce["config"];

    constructor(protected Sauce :Sauce<custom>) {
        this.req = Sauce.req;
        this.currentRoute = Sauce.currentRoute;
        this.res = Sauce.res;
        this.next = Sauce.next;
        this.route = Sauce.currentRoute;
        this.config = Sauce.config;
        this.responses = new Responses(this.res);
    }
}
