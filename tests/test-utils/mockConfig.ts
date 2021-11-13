import {ApolloConfig} from "../../core";
import {mockRouteParam, mockRouteWithPathParams} from "./mockRoute";

interface MockPolicyOptions{
    policyOne: ()=>{},
    policyTwo: ()=>{}
}

export const mockConfig :ApolloConfig<MockPolicyOptions> = {
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
        policyOne: ()=>{},
        policyTwo: ()=>{}
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
