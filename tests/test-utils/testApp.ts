import * as express from "express";
import { Application } from "express";
import { Responses, Rocket, Routes, } from "../../core/index";
import { mockConfig } from "./mockConfig";

export class App {
    public app :Application;
    public port :number = 1337;

    constructor(bindRoutes :boolean = true) {
        this.app = express();
        this.setupBodyParsers();
        if(bindRoutes) {
            this.bindRoutes();
        }
    }

    private setupBodyParsers() :void {
        this.app.use(<any>express.json());
        this.app.use(<any>express.urlencoded({extended: true}));
    }

    private bindRoutes() :void {
        console.log("Binding Routes...");

        new Routes(mockConfig()).bindRotues({
            app: this.app,
            routeHooks: {
                before: null,
                after: null
            },
            apolloCustom: {},
        });

        this.app.get("*", (req, res)=>{
            this.notFound(req, res, "GET");
        });
        this.app.post("*", (req, res)=>{
            this.notFound(req, res, "POST");
        });
        this.app.put("*", (req, res)=>{
            this.notFound(req, res, "PUT");
        });
        this.app.delete("*", (req, res)=>{
            this.notFound(req, res, "DELETE");
        });

        console.log("Routes bound.");
    }

    private notFound(req, res, method) :void {
        new Responses(res).notFound(`${method} ${req.path} is not a valid operation`);
    }

    private setupHttpServer() :void {
        this.app.listen(this.port, () => {
            new Rocket(mockConfig()).launch();
            console.log(`Apollo API has launched on port ${this.port}!`);
        });
    }

    public listen() {
        this.setupHttpServer();
    }

    public getApp() :Application {
        return this.app;
    }
}

export const testApp :App = new App();
