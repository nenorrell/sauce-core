import {expect} from "chai";
import {Route} from "../../../core/routes/Route";
import {RouteParam} from "../../../core/routes/RouteParam";


describe("Routes", ()=> {
    let route :Route;
    beforeEach(()=>{
        route = new Route()
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
    });

    describe("Body Schema", ()=> {
        it("Should build body schema properly", (done)=>{
            expect(route.bodySchema).to.be.an("array");
            expect(route.bodySchema[0] instanceof RouteParam).to.eq(true);

            expect(route.bodySchema[0].children).to.be.an("array");
            expect(route.bodySchema[0].children.length).to.be.eq(3);
            expect(route.bodySchema[0].children[0] instanceof RouteParam).to.eq(true);

            expect(route.bodySchema[0].children[2].children).to.be.an("array");
            expect(route.bodySchema[0].children[2].children.length).to.be.eq(2);
            expect(route.bodySchema[0].children[2].children[0] instanceof RouteParam).to.eq(true);
            done();
        });

        it("Should format body schema properly", (done)=>{
            expect(route.getFormattedBodySchema()).to.be.an("object");
            expect(route.getFormattedBodySchema()).to.deep.eq({
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
            });
            done();
        });
    });
});
