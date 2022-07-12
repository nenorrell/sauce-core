import {expect} from "chai";
import {spy, SinonSpy} from "sinon";
import * as request from "supertest";
import { RouteValidator } from "../../core/routes/RouteValidator";
import {testApp} from "../test-utils/testApp";

describe("RouteValidator integration testing", ()=> {
    describe("GET /test", async ()=> {
        let runValidationsSpy :SinonSpy;
        let checkPoliciesSpy :SinonSpy;

        beforeEach(()=>{
            runValidationsSpy = spy(RouteValidator.prototype, "runValidations");
            checkPoliciesSpy = spy(RouteValidator.prototype, "checkPolicies");
        });

        afterEach(()=>{
            runValidationsSpy.restore();
            checkPoliciesSpy.restore();
        });

        it("Should make request", async ()=>{
            await request(testApp.getApp())
                .get("/test")
                .expect(200);
            expect(runValidationsSpy.calledOnce).to.eq(true);
            expect(checkPoliciesSpy.calledOnce).to.eq(true);
        });
    });
});
