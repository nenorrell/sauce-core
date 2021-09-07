import {expect} from "chai";
import { Routes } from "../../core/routes/routes";
import { Route } from "../../core/routes/Route";
import { RouteParam } from "../../core/routes/RouteParam";
import { MockConfig } from "../test-utils/MockConfig";

let routes :Routes;
describe('Routes', ()=> {
    beforeEach(()=>{
        routes = new Routes(MockConfig);
    })

    describe("formatRoutes()", ()=> {
        it('Should format routes properly', async ()=>{
            let testRoute = new Route()
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
            ]);
            let formattedVals = await routes.formatRoutes([testRoute]);
            expect(formattedVals).to.be.an("array")
            expect(formattedVals).to.deep.eq([{
                "method": "post",
                "path": "/examples/complex/:someParam",
                "action": "index",
                "description": "This endpoint is an example of what a more complex route might look like",
                "pathParams": [
                    {
                        "name": "someParam",
                        "description": "Some path param",
                        "required": true,
                        "type": "number"
                    }
                ],
                "queryParams": [
                    {
                        "name": "test",
                        "required": true,
                        "type": "string"
                    }
                ],
                "bodySchema": {
                    "group": {
                        "name": {
                            "name": "name",
                            "description": "The Name of the group",
                            "required": true,
                            "type": "string"
                        },
                        "Level": {
                            "name": "Level",
                            "description": "The level of the group",
                            "required": true,
                            "type": "string"
                        },
                        "members": [
                            {
                                "name": {
                                    "name": "name",
                                    "description": "The name of the group user",
                                    "required": true,
                                    "type": "string"
                                },
                                "level": {
                                    "name": "level",
                                    "description": "The level of the group user",
                                    "required": true,
                                    "type": "number"
                                }
                            }
                        ]
                    }
                }
            }]);
        });
    });
});