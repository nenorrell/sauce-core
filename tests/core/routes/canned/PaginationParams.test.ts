import {expect} from "chai";
import { getPaginationParams } from "../../../../core";

describe("PaginationParams", ()=> {
    describe("getPaginationParams()", ()=>{
        it("Should retrieve pagination query params with max defined", (done)=>{
            const params = getPaginationParams(25);

            expect(params.length).to.eq(2);
            expect(params[0].name).to.eq("pageSize");
            expect(params[0].description).to.eq("The amount of items to return for each page (max 25)");
            expect(params[0].type).to.eq("number");
            expect(params[0].required).to.eq(false);

            expect(params[1].name).to.eq("page");
            expect(params[1].description).to.eq("The page number you're requesting");
            expect(params[1].type).to.eq("number");
            expect(params[1].required).to.eq(false);
            done();
        });

        it("Should retrieve pagination query params with max undefined", (done)=>{
            const params = getPaginationParams();

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
