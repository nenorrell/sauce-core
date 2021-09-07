import { mock } from "sinon";
import { buildApolloObj } from "../../core/Apollo";
import { MockConfig } from "./MockConfig";

type MockedApollo = {
    req ?:any,
    res ?:any,
    next ?:any,
    app ?:any,
    currentRoute ?:any
}

export const MockApollo = (mocked ?:MockedApollo) :void=>{
    buildApolloObj({
        config: MockConfig,
        req: (mocked||{}).req || <any>mock(),
        res: (mocked||{}).res || <any>mock(),
        next: (mocked||{}).next || <any>mock(),
        app: (mocked||{}).app || <any>mock(),
        currentRoute: (mocked||{}).currentRoute || <any>mock()
    }
    );
}