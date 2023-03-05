import {mock} from "sinon";
import { SauceConfig } from "../../core";
import {buildSauceObj, Sauce} from "../../core/Sauce";
import {mockConfig} from "./mockConfig";

type MockedSauce = {
    req ?:any
    res ?:any
    next ?:any
    app ?:any
    currentRoute ?:any
    config ?:Partial<SauceConfig>
}

export const mockSauce = (mocked ?:MockedSauce) :Sauce=>{
    return buildSauceObj({
        config: mockConfig(mocked?.config),
        req: mocked?.req || <any>mock(),
        res: mocked?.res || <any>mock(),
        next: mocked?.next || <any>mock(),
        app: mocked?.app || <any>mock(),
        currentRoute: mocked?.currentRoute || <any>mock()
    });
};
