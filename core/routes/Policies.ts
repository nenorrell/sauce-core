import { ApolloConfig } from "../resources/ApolloConfig";

export class Policies{
    private list :Map<String, Function> = new Map();
    
    constructor(config :ApolloConfig){
        try{
            if(config.policies){
                this.setPolicies(config.policies);
            }
        }
        catch(e){
            throw e;
        }
    }

    public async runPolicy(policyName :string) :Promise<void>{
        const policy = this.list.get(policyName);
        await policy();
    }

    private setPolicies(policies :ApolloConfig["policies"]) :void{
        const policyKeys = Object.keys(policies);
        for(const policyName in policyKeys){
            this.list.set(policyName, policies[policyName]);
        }
    }
}