import {mock} from "sinon";
import {buildApolloObj} from "../../core/Apollo";
import {mockConfig} from "./mockConfig";

type MockedApollo = {
    req ?:any,
    res ?:any,
    next ?:any,
    app ?:any,
    currentRoute ?:any
}

export const mockApollo = (mocked ?:MockedApollo) :void=>{
    buildApolloObj({
        config: mockConfig,
        req: (mocked||{}).req || <any>mock(),
        res: (mocked||{}).res || <any>mock(),
        next: (mocked||{}).next || <any>mock(),
        app: (mocked||{}).app || <any>mock(),
        currentRoute: (mocked||{}).currentRoute || <any>mock()
    }
    );
};
