import {expect} from "chai";
import {mock} from "sinon";
import { mockConfig } from "../test-utils/mockConfig";
import { mockRouteWithPathParams } from "../test-utils/mockRoute";
import { buildApolloObj } from "../../core";

describe("Apollo Tests", ()=> {
    describe("buildApolloObj()", ()=>{
        let apolloObj;
        beforeEach(()=>{
            apolloObj = {
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
                }]),
                res: <any>mock(),
                next: <any>mock(),
                app: <any>mock(),
                config: mockConfig,
            };
        });

        it("Should build Apollo object without custom", done =>{
            const apollo = buildApolloObj(apolloObj);
            console.log(apollo);
            expect(apollo).to.deep.equal({
                ...apolloObj
            });
            done();
        });

        it("Should add custom object to Apollo object", done =>{
            const custom = {
                somethingHere: mock(),
                someOtherThing: "Some string"
            };
            const apollo = buildApolloObj({
                ...apolloObj,
                custom
            });
            expect(apollo).to.deep.equal({
                ...apolloObj,
                custom
            });
            done();
        });
    });
});
