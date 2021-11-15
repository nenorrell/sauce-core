import {expect} from "chai";
import {mockApollo} from "../test-utils/mockApollo";
import {Controller} from "../../core/Controller";
import {mockRouteWithPathParams, mockRouteWithQueryParams, mockRouteWithBodyParams} from "../test-utils/mockRoute";
import {RouteParam} from "../../core/routes/RouteParam";


let controller :Controller;

describe("Controller", ()=> {
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
            controller = new Controller(Apollo);
            const result = await controller["validatePathParams"].bind(controller)();
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
            controller = new Controller(Apollo);
            expect(await controller["validatePathParams"].bind(controller)()).to.be.an("array");
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
            controller = new Controller(Apollo);
            expect(await controller["validatePathParams"].bind(controller)()).to.be.an("array");
            expect(controller["req"].params.userId).to.be.a("number");
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
            controller = new Controller(Apollo);
            expect(await controller["validatePathParams"].bind(controller)()).to.be.an("array");
            expect(controller["req"].params.someParam).to.be.true;
        });

        it("Should throw error if param is required and not sent", async ()=>{
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

            controller = new Controller(Apollo);
            try{
                await controller["validatePathParams"]();
            }
            catch(e) {
                expect(e).to.deep.eq({
                    status: 400,
                    details: "GET /users/test is not a valid request path"
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

            controller = new Controller(Apollo);
            expect(await controller["validateQueryParams"].bind(controller)()).to.be.an("array");
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

            controller = new Controller(Apollo);
            expect(await controller["validateQueryParams"].bind(controller)()).to.be.an("array");
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

            controller = new Controller(Apollo);
            expect(await controller["validateQueryParams"].bind(controller)()).to.be.an("array");
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
            controller = new Controller(Apollo);
            expect(await controller["validateQueryParams"].bind(controller)()).to.be.an("array");
            expect(controller["req"].query.numberParam).to.be.a("number");
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
            controller = new Controller(Apollo);
            expect(await controller["validateQueryParams"].bind(controller)()).to.be.an("array");
            expect(controller["req"].query.booleanParam).to.be.true;
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

            controller = new Controller(Apollo);
            try{
                await controller["validateQueryParams"]();
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

            controller = new Controller(Apollo);
            try{
                await controller["validateQueryParams"]();
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

            controller = new Controller(Apollo);
            expect(await controller["validateQueryParams"].bind(controller)()).to.be.an("array");
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

            controller = new Controller(Apollo);
            try{
                await controller["validateQueryParams"]();
            }
            catch(e) {
                expect(e).to.deep.eq({
                    status: 400,
                    details: "Invalid enum value for enumParam: enumValue"
                });
            }
        });
    });

    describe("validateReqBody()", ()=>{
        let paramsWithChildren;

        before(()=>{
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

            controller = new Controller(Apollo);
            expect(await controller["validateReqBody"].bind(controller)()).to.be.an("array");
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

            controller = new Controller(Apollo);
            expect(await controller["validateReqBody"].bind(controller)()).to.be.an("array");
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
            controller = new Controller(Apollo);
            expect(await controller["validateReqBody"].bind(controller)()).to.be.an("array");
            expect(controller["req"].body.children.child2).to.be.a("number");
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

            controller = new Controller(Apollo);
            try{
                await controller["validateReqBody"]();
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

            controller = new Controller(Apollo);
            try{
                await controller["validateReqBody"]();
            }
            catch(e) {
                expect(e).to.deep.eq({
                    status: 400,
                    details: "Invalid param type for child2: Expected number but got string"
                });
            }
        });
    });
});
