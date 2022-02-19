import * as responseMethods from "../../core/Responses";
import {Responses} from "../../core/Responses";
import {mock, spy, SinonSpy} from "sinon";
import {expect} from "chai";

describe("Responses", ()=>{
    describe("Responses class", ()=>{
        let res;

        let formatObjectResponse :SinonSpy;
        let formatArrayResponse :SinonSpy;
        let formatPaginatedResponse :SinonSpy;
        let formatErrorResponse :SinonSpy;

        beforeEach(()=>{
            res = {
                send: mock().returnsThis(),
                json: mock().returnsThis(),
                status: mock().returnsThis(),
            };
            formatObjectResponse = spy(responseMethods, "formatObjectResponse");
            formatArrayResponse = spy(responseMethods, "formatArrayResponse");
            formatPaginatedResponse = spy(responseMethods, "formatPaginatedResponse");
            formatErrorResponse = spy(responseMethods, "formatErrorResponse");
        });

        afterEach(()=>{
            formatObjectResponse.restore();
            formatArrayResponse.restore();
            formatPaginatedResponse.restore();
            formatErrorResponse.restore();
        });

        it("Should handle text response properly", (done)=>{
            const responses = new Responses(<any>res);
            responses.responseText(200, "Okay");
            expect(res.status.calledOnce).to.eq(true);
            expect(res.send.calledOnce).to.eq(true);
            done();
        });

        it("Should handle object response properly", (done)=>{
            const responses = new Responses(<any>res);
            const data = {
                id: 1,
                someProp: "some value"
            };
            responses.responseObject(200, data);
            expect(res.status.calledOnce).to.eq(true);
            expect(res.json.calledOnce).to.eq(true);
            expect(formatObjectResponse.calledOnceWithExactly(200, data)).to.eq(true);
            done();
        });

        it("Should handle array response properly", (done)=>{
            const responses = new Responses(<any>res);
            const data = [
                {
                    id: 1,
                    someProp: "some value"
                },
                {
                    id: 2,
                    someProp: "some other value"
                }
            ];
            responses.responseArray(200, data);
            expect(res.status.calledOnce).to.eq(true);
            expect(res.json.calledOnce).to.eq(true);
            expect(formatArrayResponse.calledOnceWithExactly(200, data)).to.eq(true);
            done();
        });

        it("Should handle paginated response properly", (done)=>{
            const responses = new Responses(<any>res);
            const data = {
                data: [
                    {
                        id: 1,
                        someProp: "some value"
                    },
                    {
                        id: 2,
                        someProp: "some other value"
                    }
                ],
                page: {
                    current: 2,
                    prev: "https://someApiCallForPrev",
                    next: "https://someApiCallForNext",
                    size: 2
                }
            };

            responses.responsePaginated(200, data);
            expect(res.status.calledOnce).to.eq(true);
            expect(res.json.calledOnce).to.eq(true);
            expect(formatPaginatedResponse.calledOnceWithExactly(200, data)).to.eq(true);
            done();
        });

        it("Should handle badRequest properly", (done)=>{
            const responses = new Responses(<any>res);
            const errMsg = "you can't do that";

            responses.badRequest(errMsg);
            expect(res.status.calledOnce).to.eq(true);
            expect(res.json.calledOnce).to.eq(true);
            expect(formatErrorResponse.calledOnceWithExactly(400, "Bad Request", errMsg)).to.eq(true);
            done();
        });

        it("Should handle notFound properly", (done)=>{
            const responses = new Responses(<any>res);
            const errMsg = "Something not found";

            responses.notFound(errMsg);
            expect(res.status.calledOnce).to.eq(true);
            expect(res.json.calledOnce).to.eq(true);
            expect(formatErrorResponse.calledOnceWithExactly(404, "Not Found", errMsg)).to.eq(true);
            done();
        });

        it("Should handle serverError properly", (done)=>{
            const responses = new Responses(<any>res);
            const errMsg = "Something broke";

            responses.serverError(errMsg);
            expect(res.status.calledOnce).to.eq(true);
            expect(res.json.calledOnce).to.eq(true);
            expect(formatErrorResponse.calledOnceWithExactly(500, "Internal Server Error", errMsg)).to.eq(true);
            done();
        });

        it("Should handle unauthorized properly", (done)=>{
            const responses = new Responses(<any>res);
            const errMsg = "You don't have permissions for this";

            responses.unauthorized(errMsg);
            expect(res.status.calledOnce).to.eq(true);
            expect(res.json.calledOnce).to.eq(true);
            expect(formatErrorResponse.calledOnceWithExactly(401, "Unauthorized", errMsg)).to.eq(true);
            done();
        });
    });

    describe("Format methods", ()=>{
        it("Should format properly with formatObjectResponse", (done)=>{
            const data = {
                id: 1,
                someProp: "some value"
            };
            const expected = responseMethods.formatObjectResponse(200, data);
            expect(expected).to.deep.eq({
                code: 200,
                response: data
            });
            done();
        });

        it("Should format properly with formatArrayResponse", (done)=>{
            const data = [
                {
                    id: 1,
                    someProp: "some value"
                },
                {
                    id: 2,
                    someProp: "some other value"
                }
            ];
            const expected = responseMethods.formatArrayResponse(200, data);
            expect(expected).to.deep.eq({
                code: 200,
                response: data
            });
            done();
        });

        it("Should format properly with formatPaginatedResponse", (done)=>{
            const mockRes = {
                data: [
                    {
                        id: 1,
                        someProp: "some value"
                    },
                    {
                        id: 2,
                        someProp: "some other value"
                    }
                ],
                page: {
                    current: 2,
                    prev: "https://someApiCallForPrev",
                    next: "https://someApiCallForNext",
                    size: 2
                }
            };

            const expected = responseMethods.formatPaginatedResponse(200, mockRes);
            expect(expected).to.deep.eq({
                code: 200,
                response: mockRes.data,
                page: mockRes.page
            });
            done();
        });

        it("Should format properly with errorResponse", (done)=>{
            const expected = responseMethods.formatErrorResponse(404, "Not Found", "Nothing found for that");
            expect(expected).to.deep.eq({
                response: {},
                code: 404,
                error: "Not Found",
                error_description: "Nothing found for that"
            });
            done();
        });

        it("Should format properly with errorResponse without description message", (done)=>{
            const expected = responseMethods.formatErrorResponse(404, "Not Found");
            expect(expected).to.deep.eq({
                response: {},
                code: 404,
                error: "Not Found",
                error_description: ""
            });
            done();
        });
    });
});
