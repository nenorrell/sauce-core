import {expect} from "chai";
import {spy, mock, SinonSpy} from "sinon";
import * as request from "supertest";
import { Controller, Routes } from "../../core";
import { mockConfig } from "../test-utils/mockConfig";
import {testApp, App} from "../test-utils/testApp";

describe("Controller integration testing", ()=> {
    describe("GET /test", async ()=> {
        let runValidationsSpy :SinonSpy;
        let checkPoliciesSpy :SinonSpy;

        beforeEach(()=>{
            runValidationsSpy = spy(Controller.prototype, "runValidations");
            checkPoliciesSpy = spy(Controller.prototype, "checkPolicies");
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

        it("Should run route hooks", async ()=>{
            const beforeHookSpy = mock();
            const afterHookSpy = mock();
            const config = mockConfig();
            const app = new App(false).getApp();
            new Routes(config).bindRotues({
                app,
                routeHooks: {
                    before: beforeHookSpy,
                    after: afterHookSpy
                },
                apolloCustom: {},
            });

            await request(app)
                .get("/test")
                .expect(200);
            expect(beforeHookSpy.calledOnce).to.eq(true);
            expect(beforeHookSpy.calledBefore(runValidationsSpy)).to.eq(true);
            expect(beforeHookSpy.calledBefore(checkPoliciesSpy)).to.eq(true);
            expect(beforeHookSpy.calledBefore(afterHookSpy)).to.eq(true);

            expect(runValidationsSpy.calledOnce).to.eq(true);
            expect(checkPoliciesSpy.calledOnce).to.eq(true);

            expect(afterHookSpy.calledOnce).to.eq(true);
            expect(afterHookSpy.calledAfter(beforeHookSpy)).to.eq(true);
            expect(afterHookSpy.calledAfter(runValidationsSpy)).to.eq(true);
            expect(afterHookSpy.calledAfter(checkPoliciesSpy)).to.eq(true);
        });
    });
});
