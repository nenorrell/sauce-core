import {ApolloConfig} from "../../core";
import { ObjectOfAnything } from "../../core/resources/Common";
import {mockRouteParam, mockRouteWithPathParams} from "./mockRoute";

interface MockPolicyOptions{
    policyOne: ()=>Promise<void>,
    policyTwo: ()=>Promise<void>
}

export const mockConfig :ApolloConfig<ObjectOfAnything, MockPolicyOptions> = {
    controllerDirectory: "",
    routes: [
        mockRouteWithPathParams([
            mockRouteParam({
                name: "param1",
                type: "string",
                isRequired: true
            })
        ])
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
