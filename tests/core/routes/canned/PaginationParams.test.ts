import {expect} from "chai";
import {mockConfig} from "../../../test-utils/mockConfig";
import { getPaginationParams } from "../../../../core";

describe("PaginationParams", ()=> {
    describe("getPaginationParams()", ()=>{
        it("Should retrieve prebuilt pagination query params", (done)=>{
            const config = mockConfig();
            const params = getPaginationParams(config);

            expect(params.length).to.eq(2);
            expect(params[0].name).to.eq("pageSize");
            expect(params[0].description).to.eq("The amount of items to return for each page (max 50)");
            expect(params[0].type).to.eq("number");
            expect(params[0].required).to.eq(false);

            expect(params[1].name).to.eq("page");
            expect(params[1].description).to.eq("The page number you're requesting");
            expect(params[1].type).to.eq("number");
            expect(params[1].required).to.eq(false);
            done();
        });
    });
});
