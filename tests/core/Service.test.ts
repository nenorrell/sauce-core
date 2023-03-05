import {expect} from "chai";
import {mockSauce} from "../test-utils/mockSauce";
import {Service} from "../../core/Service";
import * as utility from "../../core/utility";
import * as Sinon from "sinon";
let service :Service;

describe("Service", ()=> {
    describe("buildPaginationQuery()", ()=>{
        it("Should build pagination properties properly for first page", (done)=>{
            const Sauce = mockSauce({
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
            service = new Service(Sauce);

            expect(service["buildPaginationQuery"]()).to.deep.equal({
                limit: 25,
                skip: 0
            });
            done();
        });

        it("Should build pagination properties properly for subsequent pages", (done)=>{
            const Sauce = mockSauce({
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
            service = new Service(Sauce);

            expect(service["buildPaginationQuery"]()).to.deep.equal({
                limit: 25,
                skip: 50
            });
            done();
        });

        it("Should respect the limit of pageSize", (done)=>{
            const Sauce = mockSauce({
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
            service = new Service(Sauce);
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
            const Sauce = mockSauce({
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
            service = new Service(Sauce);
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
                    size: 5
                }
            });
            done();
        });

        it("Should handle total in pagination", (done)=>{
            const Sauce = mockSauce({
                req: {
                    query: {
                        page: 2,
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
            service = new Service(Sauce);
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
            expect(service.paginate(mockData, mockData.length)).to.deep.eq({
                data: mockData,
                page: {
                    current: 2,
                    next: "https://someUrl.com/some/path?page=3&pageSize=1",
                    prev: "https://someUrl.com/some/path?page=1&pageSize=1",
                    size: 5,
                    totalPages: 5
                }
            });
            done();
        });
    });
});
