import { ApolloType } from "../Apollo";
import {ApolloConfig} from "../resources/ApolloConfig";

export type policyMethod = (Apollo :ApolloType)=>Promise<void>
export class Policies {
    private list :Map<String, policyMethod> = new Map();

    constructor(private config :ApolloConfig, private Apollo :ApolloType) {
        try{
            if(config.policies) {
                this.setPolicies(config.policies);
            }
        }
        catch(e) {
            throw e;
        }
    }

    public async runPolicy(policyName :string) :Promise<void> {
        try{
            const policy = this.list.get(policyName);
            await policy(this.Apollo);
        }
        catch(err) {
            throw new Error(err);
        }
    }

    private setPolicies(policies :ApolloConfig["policies"]) :void {
        const policyKeys = Object.keys(policies);

        // It's super not ideal to use .forEach here since it's blocking. But
        // it should be pretty much a non factor since routes will typically
        // only have just a few policies
        policyKeys.forEach((name) => this.list.set(name, policies[name]));
    }
}
