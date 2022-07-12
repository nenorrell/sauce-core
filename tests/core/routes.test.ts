import {expect} from "chai";
import {spy, SinonSpy} from "sinon";
import {Routes} from "../../core/routes/Routes";
import {Route} from "../../core/routes/Route";
import {RouteParam} from "../../core/routes/RouteParam";
import {mockConfig} from "../test-utils/mockConfig";
import * as policyMethods from "../../core/routes/Policies";
import {App} from "../test-utils/testApp";

describe("Routes", ()=> {
    let routes :Routes;
    const config = mockConfig();
    beforeEach(()=>{
        routes = new Routes(config);
    });

    describe("getFormattedRoutes()", ()=> {
        it("Should format routes properly", async ()=>{
            const testRoute = new Route()
                .setMethod("POST")
                .setPath("/examples/complex/:someParam")
                .setDescription("This endpoint is an example of what a more complex route might look like")
                .setCustomControllerPath("examples/examples.controller.ts")
                .setAction("index")
                .setPathParams([
                    new RouteParam()
                        .setName("someParam")
                        .setDescription("Some path param")
                        .setType("number")
                        .setRequired(true)
                ])
                .setQueryParams([
                    new RouteParam()
                        .setName("test")
                        .setRequired(true)
                        .setType("string")
                ])
                .setBodySchema([
                    new RouteParam()
                        .setName("group")
                        .setDescription("Group object")
                        .setRequired(true)
                        .setType("object")
                        .setChildren([
                            new RouteParam()
                                .setName("name")
                                .setDescription("The Name of the group")
                                .setRequired(true)
                                .setType("string"),

                            new RouteParam()
                                .setName("Level")
                                .setDescription("The level of the group")
                                .setRequired(true)
                                .setType("string"),

                            new RouteParam()
                                .setName("members")
                                .setDescription("The level of the group")
                                .setRequired(true)
                                .setType("array")
                                .setChildren([
                                    new RouteParam()
                                        .setName("name")
                                        .setDescription("The name of the group user")
                                        .setRequired(true)
                                        .setType("string"),

                                    new RouteParam()
                                        .setName("level")
                                        .setDescription("The level of the group user")
                                        .setRequired(true)
                                        .setType("number")
                                ])
                        ])
                ])
                .setExampleResponse({
                    code: 200,
                    response: {
                        some: "value",
                    },
                });

            routes.routesArray = [testRoute];
            const formattedVals = await routes.getFormattedRoutes();

            expect(formattedVals).to.be.an("array");
            expect(formattedVals).to.deep.eq([{
                method: "post",
                path: "/examples/complex/:someParam",
                action: "index",
                description: "This endpoint is an example of what a more complex route might look like",
                exampleResponse: {
                    code: 200,
                    response: {
                        some: "value",
                    },
                },
                isDeprecated: false,
                pathParams: [
                    {
                        "name": "someParam",
                        "description": "Some path param",
                        "required": true,
                        "type": "number"
                    }
                ],
                queryParams: [
                    {
                        "name": "test",
                        "required": true,
                        "type": "string"
                    }
                ],
                bodySchema: {
                    group: {
                        name: {
                            name: "name",
                            description: "The Name of the group",
                            required: true,
                            type: "string"
                        },
                        Level: {
                            name: "Level",
                            description: "The level of the group",
                            required: true,
                            type: "string"
                        },
                        members: [
                            {
                                name: {
                                    name: "name",
                                    description: "The name of the group user",
                                    required: true,
                                    type: "string"
                                },
                                level: {
                                    name: "level",
                                    description: "The level of the group user",
                                    required: true,
                                    type: "number"
                                }
                            }
                        ]
                    }
                }
            }]);
        });

        it("Should strip hidden route from formatting when stripHidden true", async ()=>{
            const testRoute = new Route()
                .setMethod("POST")
                .setPath("/examples/complex/:someParam")
                .setDescription("This endpoint is an example of what a more complex route might look like")
                .setCustomControllerPath("examples/examples.controller.ts")
                .setAction("index")
                .setHidden(true)
                .setPathParams([
                    new RouteParam()
                        .setName("someParam")
                        .setDescription("Some path param")
                        .setType("number")
                        .setRequired(true)
                ])
                .setQueryParams([
                    new RouteParam()
                        .setName("test")
                        .setRequired(true)
                        .setType("string")
                ])
                .setBodySchema([
                    new RouteParam()
                        .setName("group")
                        .setDescription("Group object")
                        .setRequired(true)
                        .setType("object")
                        .setChildren([
                            new RouteParam()
                                .setName("name")
                                .setDescription("The Name of the group")
                                .setRequired(true)
                                .setType("string"),

                            new RouteParam()
                                .setName("Level")
                                .setDescription("The level of the group")
                                .setRequired(true)
                                .setType("string"),

                            new RouteParam()
                                .setName("members")
                                .setDescription("The level of the group")
                                .setRequired(true)
                                .setType("array")
                                .setChildren([
                                    new RouteParam()
                                        .setName("name")
                                        .setDescription("The name of the group user")
                                        .setRequired(true)
                                        .setType("string"),

                                    new RouteParam()
                                        .setName("level")
                                        .setDescription("The level of the group user")
                                        .setRequired(true)
                                        .setType("number")
                                ])
                        ])
                ]);

            routes.routesArray = [testRoute];
            const formattedVals = await routes.getFormattedRoutes(true);

            expect(formattedVals).to.be.an("array");
            expect(formattedVals).to.deep.eq([]);
        });

        it("Should contain hidden route in formatting when stripHidden falsy", async ()=>{
            const testRoute = new Route()
                .setMethod("POST")
                .setPath("/examples/complex/:someParam")
                .setDescription("This endpoint is an example of what a more complex route might look like")
                .setCustomControllerPath("examples/examples.controller.ts")
                .setAction("index")
                .setHidden(true)
                .setPathParams([
                    new RouteParam()
                        .setName("someParam")
                        .setDescription("Some path param")
                        .setType("number")
                        .setRequired(true)
                ])
                .setQueryParams([
                    new RouteParam()
                        .setName("test")
                        .setRequired(true)
                        .setType("string")
                ])
                .setBodySchema([
                    new RouteParam()
                        .setName("group")
                        .setDescription("Group object")
                        .setRequired(true)
                        .setType("object")
                        .setChildren([
                            new RouteParam()
                                .setName("name")
                                .setDescription("The Name of the group")
                                .setRequired(true)
                                .setType("string"),

                            new RouteParam()
                                .setName("Level")
                                .setDescription("The level of the group")
                                .setRequired(true)
                                .setType("string"),

                            new RouteParam()
                                .setName("members")
                                .setDescription("The level of the group")
                                .setRequired(true)
                                .setType("array")
                                .setChildren([
                                    new RouteParam()
                                        .setName("name")
                                        .setDescription("The name of the group user")
                                        .setRequired(true)
                                        .setType("string"),

                                    new RouteParam()
                                        .setName("level")
                                        .setDescription("The level of the group user")
                                        .setRequired(true)
                                        .setType("number")
                                ])
                        ])
                ]);

            routes.routesArray = [testRoute];
            const formattedVals = await routes.getFormattedRoutes();

            expect(formattedVals).to.be.an("array");
            expect(formattedVals).to.deep.eq([{
                method: "post",
                path: "/examples/complex/:someParam",
                action: "index",
                description: "This endpoint is an example of what a more complex route might look like",
                isDeprecated: false,
                pathParams: [
                    {
                        "name": "someParam",
                        "description": "Some path param",
                        "required": true,
                        "type": "number"
                    }
                ],
                queryParams: [
                    {
                        "name": "test",
                        "required": true,
                        "type": "string"
                    }
                ],
                bodySchema: {
                    group: {
                        name: {
                            name: "name",
                            description: "The Name of the group",
                            required: true,
                            type: "string"
                        },
                        Level: {
                            name: "Level",
                            description: "The level of the group",
                            required: true,
                            type: "string"
                        },
                        members: [
                            {
                                name: {
                                    name: "name",
                                    description: "The name of the group user",
                                    required: true,
                                    type: "string"
                                },
                                level: {
                                    name: "level",
                                    description: "The level of the group user",
                                    required: true,
                                    type: "number"
                                }
                            }
                        ]
                    }
                }
            }]);
        });
    });

    describe("bindRotues()", ()=>{
        let setPolicySpy :SinonSpy;
        beforeEach(()=>{
            setPolicySpy = spy(policyMethods, "setPolicies");
        });

        afterEach(()=>{
            setPolicySpy.restore();
        });

        it("Should set policies while building routes", (done)=>{
            routes.bindRotues({
                app: new App(false).getApp(),
                apolloCustom: {},
            });

            expect(setPolicySpy.calledOnceWithExactly(config.policies)).to.eq(true);
            done();
        });
    });
});
