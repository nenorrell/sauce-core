import {expect} from "chai";
import {mockApollo} from "../test-utils/mockApollo";
import {Service} from "../../core/Service";
import * as utility from "../../core/utility";
import * as Sinon from "sinon";
let service :Service;

describe("Service", ()=> {
    describe("buildPaginationQuery()", ()=>{
        it("Should build pagination properties properly for first page", (done)=>{
            const Apollo = mockApollo({
                req: {
                    query: {
                        page: 1,
                        pageSize: 25
                    }
                },
                currentRoute: {
                    queryParamKeys: ["page", "pageSize"],
                    hasQueryParam: ()=>{
                        return true;
                    }
                }
            });
            service = new Service(Apollo);

            expect(service["buildPaginationQuery"]()).to.deep.equal({
                limit: 25,
                skip: 0
            });
            done();
        });

        it("Should build pagination properties properly for subsequent pages", (done)=>{
            const Apollo = mockApollo({
                req: {
                    query: {
                        page: 3,
                        pageSize: 25
                    },
                },
                currentRoute: {
                    queryParamKeys: ["page", "pageSize"],
                    hasQueryParam: ()=>{
                        return true;
                    }
                }
            });
            service = new Service(Apollo);

            expect(service["buildPaginationQuery"]()).to.deep.equal({
                limit: 25,
                skip: 50
            });
            done();
        });

        it("Should respect the limit of pageSize", (done)=>{
            const Apollo = mockApollo({
                req: {
                    query: {
                        page: 3,
                        pageSize: 150
                    }
                },
                currentRoute: {
                    queryParamKeys: ["page", "pageSize"],
                    hasQueryParam: ()=>{
                        return true;
                    }
                }
            });
            service = new Service(Apollo);
            try{
                service["buildPaginationQuery"]();
            }
            catch(e) {
                expect(e).to.deep.eq({
                    status: 400,
                    details: "Page size can not exceed 50"
                });
            }
            done();
        });
    });

    describe("paginate()", ()=>{
        before(()=>{
            Sinon.stub(utility, "getAppUrl").returns("https://someUrl.com");
        });

        after(()=>{
            Sinon.reset();
        });

        it("Should return pagination object properly", (done)=>{
            const Apollo = mockApollo({
                req: {
                    query: {
                        page: 3,
                        pageSize: 1
                    },
                    path: "/some/path"
                },
                currentRoute: {
                    queryParamKeys: ["page", "pageSize"],
                    hasQueryParam: ()=>{
                        return true;
                    }
                }
            });
            service = new Service(Apollo);
            service["buildPaginationQuery"]();

            const mockData = [
                {
                    firstName: "Bruce",
                    lastName: "Wayne"
                },
                {
                    firstName: "Clark",
                    lastName: "Kent"
                },
                {
                    firstName: "Tony",
                    lastName: "Stark"
                },
                {
                    firstName: "Steve",
                    lastName: "Rodgers"
                },
                {
                    firstName: "Miles",
                    lastName: "Morales"
                }
            ];
            expect(service.paginate(mockData)).to.deep.eq({
                data: mockData,
                page: {
                    current: 3,
                    next: "https://someUrl.com/some/path?page=4&pageSize=1",
                    prev: "https://someUrl.com/some/path?page=2&pageSize=1",
                    size: 1
                }
            });
            done();
        });
    });
});
