import {ApolloConfig, Route} from "../../core";
import { ObjectOfAnything } from "../../core/resources/Common";
import * as path from "path";

type MockConfig = ApolloConfig<ObjectOfAnything, any>

export const mockConfig = (overrides ?:Partial<MockConfig>) => {
    const config :MockConfig = {
        controllerDirectory: path.resolve(__dirname, "./"),
        routes: [
            new Route()
                .setMethod("GET")
                .setPath("/test")
                .setController("testController")
                .setAction("index")
        ],
        policies: {
            policyOne: async ()=>{},
            policyTwo: async ()=>{}
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
    };

    if(overrides) {
        return {
            ...config,
            ...overrides
        };
    }

    return config;
};

