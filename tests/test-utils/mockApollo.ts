import {mock} from "sinon";
import { ApolloConfig } from "../../core";
import {buildApolloObj, Apollo} from "../../core/Apollo";
import {mockConfig} from "./mockConfig";

type MockedApollo = {
    req ?:any
    res ?:any
    next ?:any
    app ?:any
    currentRoute ?:any
    config ?:Partial<ApolloConfig>
}

export const mockApollo = (mocked ?:MockedApollo) :Apollo=>{
    return buildApolloObj({
        config: mockConfig(mocked?.config),
        req: mocked?.req || <any>mock(),
        res: mocked?.res || <any>mock(),
        next: mocked?.next || <any>mock(),
        app: mocked?.app || <any>mock(),
        currentRoute: mocked?.currentRoute || <any>mock()
    });
};
