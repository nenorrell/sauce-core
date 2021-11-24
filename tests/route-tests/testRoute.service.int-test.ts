import * as request from "supertest";
import {testApp} from "../test-utils/testApp";

describe("Version", ()=> {
    describe("GET /test", async ()=> {
        it("Should make request", async ()=>{
            await request(testApp.getApp())
                .get("/test")
                .expect(200);
        });
    });
});
