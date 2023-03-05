import {expect} from "chai";
import {mock} from "sinon";
import { mockConfig } from "../test-utils/mockConfig";
import { mockRouteWithPathParams } from "../test-utils/mockRoute";
import { buildSauceObj } from "../../core";

describe("Sauce Tests", ()=> {
    describe("buildSauceObj()", ()=>{
        let sauceObj;
        beforeEach(()=>{
            sauceObj = {
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
                config: mockConfig(),
            };
        });

        it("Should build Sauce object without custom", done =>{
            const sauce = buildSauceObj(sauceObj);
            expect(sauce).to.deep.equal({
                ...sauceObj
            });
            done();
        });

        it("Should add custom object to Sauce object", done =>{
            const custom = {
                somethingHere: mock(),
                someOtherThing: "Some string"
            };
            const sauce = buildSauceObj({
                ...sauceObj,
                custom
            });
            expect(sauce).to.deep.equal({
                ...sauceObj,
                custom
            });
            done();
        });
    });
});
