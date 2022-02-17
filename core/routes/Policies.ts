import { Apollo } from "../Apollo";
import {ApolloConfig} from "../resources/ApolloConfig";
import { ObjectOfAnything } from "../resources/Common";

export type policyMethod<custom> = (Apollo :Apollo<custom>)=>Promise<void>;
export type policyList<custom> = Map<String, policyMethod<custom>>;

export function setPolicies<custom=ObjectOfAnything>(policies :ApolloConfig["policies"]) {
    const list :policyList<custom> = new Map();
    if(policies) {
        const policyKeys = Object.keys(policies);
        policyKeys.forEach((name) => list.set(name, policies[name]));
    }
    return list;
};

export class Policies<custom=ObjectOfAnything> {
    constructor(private policyList :policyList<custom>) {}

    public async runPolicy(policyName :string, Apollo :Apollo<custom>) :Promise<void> {
        try{
            const policy = this.policyList.get(policyName);
            await policy(Apollo);
        }
        catch(err) {
            throw err;
        }
    }
}
