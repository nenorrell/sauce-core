import {mock} from "sinon";
import {expect} from "chai";
import {mockApollo} from "../../test-utils/mockApollo";
import {mockRouteWithPathParams, mockRouteWithQueryParams, mockRouteWithBodyParams} from "../../test-utils/mockRoute";
import {RouteParam} from "../../../core/routes/RouteParam";
import { setPolicies } from "../../../core/routes/Policies";
import { formatError, Route } from "../../../core";
import { RouteValidator } from "../../../core/routes/RouteValidator";

let routeValidator :RouteValidator;

describe("RouteValidator", ()=> {
    describe("checkPolicies()", ()=>{
        it("Should run route policy", async ()=>{
            const testPolicy = mock();
            const currentRoute = new Route()
                .setMethod("GET")
                .setPolicies(["testPolicy"]);

            const Apollo = mockApollo({
                req: {
                    params: {
                        userId: "1"
                    },
                    path: "/users/1"
                },
                currentRoute,
                config: {
                    policies: {
                        testPolicy
                    }
                }
            });

            routeValidator = new RouteValidator(Apollo);
            const policyList = setPolicies(Apollo.config.policies);
            await routeValidator.checkPolicies(policyList);

            expect(testPolicy.calledOnce).to.eq(true);
        });

        it("Should only policies associated with route", async ()=>{
            const testPolicy = mock();
            const someOtherTestPolicy = mock();
            const currentRoute = new Route()
                .setMethod("GET")
                .setPolicies(["someOtherTestPolicy"]);

            const Apollo = mockApollo({
                req: {
                    params: {
                        userId: "1"
                    },
                    path: "/users/1"
                },
                currentRoute,
                config: {
                    policies: {
                        testPolicy,
                        someOtherTestPolicy
                    }
                }
            });

            routeValidator = new RouteValidator(Apollo);
            const policyList = setPolicies(Apollo.config.policies);
            await routeValidator.checkPolicies(policyList);

            expect(testPolicy.calledOnce).to.eq(false);
            expect(someOtherTestPolicy.calledOnce).to.eq(true);
        });
    });

    describe("validatePathParams()", ()=>{
        it("Should not throw error if param matches validations", async ()=>{
            const Apollo = mockApollo({
                req: {
                    params: {
                        userId: "1"
                    },
                    path: "/users/1"
                },
                currentRoute: mockRouteWithPathParams([{
                    name: "userId",
                    type: "number",
                    isRequired: true
                }])
            });
            routeValidator = new RouteValidator(Apollo);
            const result = await routeValidator["validatePathParams"].bind(routeValidator)();
            expect(result).to.be.an("array");
        });

        it("Should not throw error if multiple params matches validations", async ()=>{
            const Apollo = mockApollo({
                req: {
                    params: {
                        userId: "1",
                        otherParam: "someValue"
                    },
                    path: "/users/1"
                },
                currentRoute: mockRouteWithPathParams([
                    {
                        name: "userId",
                        type: "number",
                        isRequired: true
                    },
                    {
                        name: "otherParam",
                        type: "string",
                        isRequired: true
                    }
                ])
            });
            routeValidator = new RouteValidator(Apollo);
            expect(await routeValidator["validatePathParams"].bind(routeValidator)()).to.be.an("array");
        });

        it("Should convert path param number string to number", async ()=>{
            const Apollo = mockApollo({
                req: {
                    params: {
                        userId: "1"
                    },
                    path: "/users/1"
                },
                currentRoute: mockRouteWithPathParams([
                    {
                        name: "userId",
                        type: "number",
                        isRequired: true
                    }
                ])
            });
            routeValidator = new RouteValidator(Apollo);
            expect(await routeValidator["validatePathParams"].bind(routeValidator)()).to.be.an("array");
            expect(routeValidator["req"].params.userId).to.be.a("number");
        });

        it("Should convert path param boolean string to bool", async ()=>{
            const Apollo = mockApollo({
                req: {
                    params: {
                        someParam: "true"
                    },
                    path: "/path/true"
                },
                currentRoute: mockRouteWithPathParams([
                    {
                        name: "someParam",
                        type: "boolean",
                        isRequired: true
                    }
                ])
            });
            routeValidator = new RouteValidator(Apollo);
            expect(await routeValidator["validatePathParams"].bind(routeValidator)()).to.be.an("array");
            expect(routeValidator["req"].params.someParam).to.be.true;
        });

        it("Should throw error if param is sent as the wrong type", async ()=>{
            const Apollo = mockApollo({
                req: {
                    params: {
                        userId: "test"
                    },
                    path: "/users/test"
                },
                currentRoute: mockRouteWithPathParams([
                    {
                        name: "userId",
                        type: "number",
                        isRequired: true
                    }
                ])
            });

            routeValidator = new RouteValidator(Apollo);
            try{
                await routeValidator["validatePathParams"]();
            }
            catch(e) {
                expect(e).to.deep.eq({
                    status: 400,
                    details: "GET /users/test is not a valid request path"
                });
            }
        });

        it("Should run customValidator", async ()=>{
            const stub = mock();
            const Apollo = mockApollo({
                req: {
                    params: {
                        userId: 1
                    },
                    path: "/users/1"
                },
                currentRoute: mockRouteWithPathParams([
                    {
                        name: "userId",
                        type: "number",
                        isRequired: true,
                        customValidator: stub
                    }
                ])
            });

            routeValidator = new RouteValidator(Apollo);
            await routeValidator["validatePathParams"]();
            expect(stub.called).to.equal(true);
        });

        it("customValidator should throw error", async ()=>{
            const Apollo = mockApollo({
                req: {
                    params: {
                        userId: 1
                    },
                    path: "/users/1"
                },
                currentRoute: mockRouteWithPathParams([
                    {
                        name: "userId",
                        type: "number",
                        isRequired: true,
                        customValidator: (paramConfig, value, req)=>{
                            if(value !== 2) {
                                throw formatError(400, "Custom validation failed");
                            }
                        }
                    }
                ])
            });

            routeValidator = new RouteValidator(Apollo);
            try {
                await routeValidator["validatePathParams"]();
            }
            catch(err) {
                expect(err).to.deep.eq({
                    status: 400,
                    details: "Custom validation failed"
                });
            }
        });
    });

    describe("validateQueryParams()", ()=>{
        it("Should not throw error if params match validations", async ()=>{
            const Apollo = mockApollo({
                req: {
                    query: {
                        someParam: "someParam"
                    },
                    path: "/some/route"
                },
                currentRoute: mockRouteWithQueryParams([{
                    name: "someParam",
                    type: "string",
                    isRequired: true
                }])
            });

            routeValidator = new RouteValidator(Apollo);
            expect(await routeValidator["validateQueryParams"].bind(routeValidator)()).to.be.an("array");
        });

        it("Should not throw error if params match validations (multiple query params)", async ()=>{
            const Apollo = mockApollo({
                req: {
                    query: {
                        someParam: "someParam",
                        someOtherParam: 1
                    },
                    path: "/some/route"
                },
                currentRoute: mockRouteWithQueryParams([
                    {
                        name: "someParam",
                        type: "string",
                        isRequired: true
                    },
                    {
                        name: "someOtherParam",
                        type: "number",
                        isRequired: true
                    }
                ])
            });

            routeValidator = new RouteValidator(Apollo);
            expect(await routeValidator["validateQueryParams"].bind(routeValidator)()).to.be.an("array");
        });

        it("Should not throw error if an optional param isn't sent", async ()=>{
            const Apollo = mockApollo({
                req: {
                    query: {
                        someParam: "someParam"
                    },
                    path: "/some/route"
                },
                currentRoute: mockRouteWithQueryParams([
                    {
                        name: "someParam",
                        type: "string",
                        isRequired: true
                    },
                    {
                        name: "someOtherParam",
                        type: "number",
                        isRequired: false
                    }
                ])
            });

            routeValidator = new RouteValidator(Apollo);
            expect(await routeValidator["validateQueryParams"].bind(routeValidator)()).to.be.an("array");
        });

        it("Should convert path param number string to number", async ()=>{
            const Apollo = mockApollo({
                req: {
                    query: {
                        numberParam: "2"
                    },
                    path: "/some/route"
                },
                currentRoute: mockRouteWithQueryParams([
                    {
                        name: "numberParam",
                        type: "number",
                        isRequired: true
                    }
                ])
            });
            routeValidator = new RouteValidator(Apollo);
            expect(await routeValidator["validateQueryParams"].bind(routeValidator)()).to.be.an("array");
            expect(routeValidator["req"].query.numberParam).to.be.a("number");
        });

        it("Should convert path param boolean string to bool", async ()=>{
            const Apollo = mockApollo({
                req: {
                    query: {
                        booleanParam: "true"
                    },
                    path: "/some/route"
                },
                currentRoute: mockRouteWithQueryParams([
                    {
                        name: "booleanParam",
                        type: "boolean",
                        isRequired: true
                    }
                ])
            });
            routeValidator = new RouteValidator(Apollo);
            expect(await routeValidator["validateQueryParams"].bind(routeValidator)()).to.be.an("array");
            expect(routeValidator["req"].query.booleanParam).to.be.true;
        });

        it("Should throw error if params are required and are not sent", async ()=>{
            const Apollo = mockApollo({
                req: {
                    query: {
                        someParam: "someParam"
                    },
                    path: "/some/route"
                },
                currentRoute: mockRouteWithQueryParams([
                    {
                        name: "someParam",
                        type: "string",
                        isRequired: true
                    },
                    {
                        name: "someOtherParam",
                        type: "number",
                        isRequired: true
                    }
                ])
            });

            routeValidator = new RouteValidator(Apollo);
            try{
                await routeValidator["validateQueryParams"]();
            }
            catch(e) {
                expect(e).to.deep.eq({
                    status: 400,
                    details: "someOtherParam was not sent and is required"
                });
            }
        });

        it("Should throw error if params values do not match expected type", async ()=>{
            const Apollo = mockApollo({
                req: {
                    query: {
                        someParam: "someParam",
                        someOtherParam: "some string"
                    },
                    path: "/some/route"
                },
                currentRoute: mockRouteWithQueryParams([
                    {
                        name: "someParam",
                        type: "string",
                        isRequired: true
                    },
                    {
                        name: "someOtherParam",
                        type: "number",
                        isRequired: true
                    }
                ])
            });

            routeValidator = new RouteValidator(Apollo);
            try{
                await routeValidator["validateQueryParams"]();
            }
            catch(e) {
                expect(e).to.deep.eq({
                    status: 400,
                    details: "Invalid param type for someOtherParam: Expected number but got string"
                });
            }
        });

        it("Should not throw error if param value is in enum choices", async ()=>{
            const Apollo = mockApollo({
                req: {
                    query: {
                        enumParam: "enumValue"
                    },
                    path: "/some/route"
                },
                currentRoute: mockRouteWithQueryParams([
                    {
                        name: "enumParam",
                        type: "enum",
                        enumValues: ["enumValue"],
                        isRequired: true
                    }
                ])
            });

            routeValidator = new RouteValidator(Apollo);
            expect(await routeValidator["validateQueryParams"].bind(routeValidator)()).to.be.an("array");
        });

        it("Should throw error if param value is not in enum", async ()=>{
            const Apollo = mockApollo({
                req: {
                    query: {
                        enumParam: "enumValue"
                    },
                    path: "/some/route"
                },
                currentRoute: mockRouteWithQueryParams([
                    {
                        name: "enumParam",
                        type: "enum",
                        enumValues: ["testVal"],
                        isRequired: true
                    }
                ])
            });

            routeValidator = new RouteValidator(Apollo);
            try{
                await routeValidator["validateQueryParams"]();
            }
            catch(e) {
                expect(e).to.deep.eq({
                    status: 400,
                    details: "Invalid enum value for enumParam: enumValue"
                });
            }
        });

        it("Should run customValidator", async ()=>{
            const stub = mock();
            const Apollo = mockApollo({
                req: {
                    query: {
                        someParam: "someParam"
                    },
                    path: "/some/route"
                },
                currentRoute: mockRouteWithQueryParams([{
                    name: "someParam",
                    type: "string",
                    isRequired: true,
                    customValidator: stub
                }])
            });

            routeValidator = new RouteValidator(Apollo);
            await routeValidator["validateQueryParams"]();
            expect(stub.called).to.equal(true);
        });

        it("customValidator should throw error", async ()=>{
            const Apollo = mockApollo({
                req: {
                    query: {
                        someParam: "someParam"
                    },
                    path: "/some/route"
                },
                currentRoute: mockRouteWithQueryParams([{
                    name: "someParam",
                    type: "string",
                    isRequired: true,
                    customValidator: (paramConfig, value, req)=>{
                        if(value !== 2) {
                            throw formatError(400, "Custom validation failed");
                        }
                    }
                }])
            });

            routeValidator = new RouteValidator(Apollo);
            try {
                await routeValidator["validateQueryParams"]();
            }
            catch(err) {
                expect(err).to.deep.eq({
                    status: 400,
                    details: "Custom validation failed"
                });
            }
        });
    });

    describe("validateReqBody()", ()=>{
        let paramsWithChildren;

        beforeEach(()=>{
            paramsWithChildren = [
                new RouteParam()
                    .setName("name")
                    .setRequired(true)
                    .setType("string"),

                new RouteParam()
                    .setName("children")
                    .setRequired(true)
                    .setType("object")
                    .setChildren([
                        new RouteParam()
                            .setName("child1")
                            .setRequired(true)
                            .setType("string"),

                        new RouteParam()
                            .setName("child2")
                            .setRequired(false)
                            .setType("number")
                    ])
            ];
        });

        it("Should not throw error if body params match validations", async ()=>{
            const Apollo = mockApollo({
                req: {
                    body: {
                        name: "test",
                        children: {
                            child1: "someString",
                            child2: "1"
                        }
                    },
                    path: "/some/route"
                },
                currentRoute: mockRouteWithBodyParams(paramsWithChildren)
            });

            routeValidator = new RouteValidator(Apollo);
            expect(await routeValidator["validateReqBody"].bind(routeValidator)()).to.be.an("array");
        });

        it("Should not throw error if an optional param isn't sent", async ()=>{
            const Apollo = mockApollo({
                req: {
                    body: {
                        name: "test",
                        children: {
                            child1: "someString"
                        }
                    },
                    path: "/some/route"
                },
                currentRoute: mockRouteWithBodyParams(paramsWithChildren)
            });

            routeValidator = new RouteValidator(Apollo);
            expect(await routeValidator["validateReqBody"].bind(routeValidator)()).to.be.an("array");
        });

        it("Should convert body param number string to number", async ()=>{
            const Apollo = mockApollo({
                req: {
                    body: {
                        name: "test",
                        children: {
                            child1: "someString",
                            child2: "1"
                        }
                    },
                    path: "/some/route"
                },
                currentRoute: mockRouteWithBodyParams(paramsWithChildren)
            });
            routeValidator = new RouteValidator(Apollo);
            expect(await routeValidator["validateReqBody"].bind(routeValidator)()).to.be.an("array");
            expect(routeValidator["req"].body.children.child2).to.be.a("number");
        });

        it("Should throw error if params are required and are not sent", async ()=>{
            const Apollo = mockApollo({
                req: {
                    body: {
                        name: "test",
                        children: {
                            child2: "1"
                        }
                    },
                    path: "/some/route"
                },
                currentRoute: mockRouteWithBodyParams(paramsWithChildren)
            });

            routeValidator = new RouteValidator(Apollo);
            try{
                await routeValidator["validateReqBody"]();
            }
            catch(e) {
                expect(e).to.deep.eq({
                    status: 400,
                    details: "child1 was not sent and is required"
                });
            }
        });

        it("Should throw error if params values do not match expected type", async ()=>{
            const Apollo = mockApollo({
                req: {
                    body: {
                        name: "test",
                        children: {
                            child1: "someString",
                            child2: "Invalid param value"
                        }
                    },
                    path: "/some/route"
                },
                currentRoute: mockRouteWithBodyParams(paramsWithChildren)
            });

            routeValidator = new RouteValidator(Apollo);
            try{
                await routeValidator["validateReqBody"]();
            }
            catch(e) {
                expect(e).to.deep.eq({
                    status: 400,
                    details: "Invalid param type for child2: Expected number but got string"
                });
            }
        });

        it("Should run customValidator", async ()=>{
            const stub :any = mock();
            const Apollo = mockApollo({
                req: {
                    body: {
                        name: "test",
                    },
                    path: "/some/route"
                },
                currentRoute: mockRouteWithBodyParams([
                    new RouteParam()
                        .setName("test")
                        .setRequired(false)
                        .setType("string")
                        .setCustomValidator(stub)
                ])
            });

            routeValidator = new RouteValidator(Apollo);
            await routeValidator["validateReqBody"]();
            expect(stub.called).to.equal(true);
        });

        it("customValidator should throw error", async ()=>{
            const Apollo = mockApollo({
                req: {
                    body: {
                        name: "test",
                    },
                    path: "/some/route"
                },
                currentRoute: mockRouteWithBodyParams([
                    new RouteParam()
                        .setName("test")
                        .setRequired(false)
                        .setType("string")
                        .setCustomValidator((paramConfig, value, req)=>{
                            if(value !== 2) {
                                throw formatError(400, "Custom validation failed");
                            }
                        })
                ])
            });

            routeValidator = new RouteValidator(Apollo);
            try{
                await routeValidator["validateReqBody"]();
            }
            catch(e) {
                expect(e).to.deep.eq({
                    status: 400,
                    details: "Custom validation failed"
                });
            }
        });
    });
});
