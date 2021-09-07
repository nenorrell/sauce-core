import {expect} from "chai";
import * as utility from "../../core/utility";

describe("Utility", ()=>{
    describe("formatError()", ()=>{
        it("Should format error properly", (done)=>{
            let error = utility.formatError(400, "Some Error");
            expect(error).to.deep.eq({
                status: 400,
                details: "Some Error"
            });
            done();
        });
    });

    describe("asyncForEach()", ()=>{
        it("Should loop through as expected", async ()=>{
            let counter :number = 0;
            let items = [1, 2, 3, 4, 5];
            await utility.asyncForEach(items, (item, index, array)=>{
                counter = index+1;
            });
            expect(counter).to.eq(5);
        });
    });
});