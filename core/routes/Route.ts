import {RouteParam} from "./RouteParam";
import {HttpMethod} from "../resources/Common";
import {ApolloResponseType} from "../resources/IResponses";

/** Configure a route for the application */
export class Route {
    public path :string;
    public method :PropertyKey;
    public controller :string;
    public customControllerPath :string;
    public action :PropertyKey;
    public policies :string[];
    public description :string;
    public tag :string;
    public pathParams :RouteParam[];
    public queryParams :RouteParam[];
    public bodySchema :RouteParam[];
    private formattedPathParams :any;
    private formattedBodySchema :any;
    private formattedQueryParams :any;
    public excludedEnvironments :string[];
    public hideFromDocs :boolean;
    public queryParamKeys :string[] = [];
    public exampleResponse :ApolloResponseType;
    public isDeprecated :boolean = false;

    public setMethod(method :HttpMethod) :Route {
        this.method = method.toString().toLocaleLowerCase();
        return this;
    }

    public setPath(path :string) :Route {
        this.path = path;
        return this;
    }

    // Mutually exclusive to this.controller
    // Controller is still expected to be in the api folder
    public setCustomControllerPath(customControllerPath :string) :Route {
        this.customControllerPath = customControllerPath;
        return this;
    }

    // Mutually exclusive to this.customControllerPath
    public setController(controller :string) :Route {
        this.controller = controller;
        return this;
    }

    public setAction(action :PropertyKey) :Route {
        this.action = action;
        return this;
    }

    public setPolicies<T=string[]>(policies :T[] | string[]) :Route {
        this.policies = policies as any;
        return this;
    }

    public setDescription(description :string) :Route {
        this.description = description;
        return this;
    }

    public setTag<T=string>(tag :T) :Route {
        this.tag = tag as any;
        return this;
    }

    public setPathParams(params :Array<RouteParam>) :Route {
        this.pathParams = params;
        this.formattedPathParams = this.formatParams(params);
        return this;
    }

    public setQueryParams(queryParams :Array<RouteParam>) :Route {
        this.queryParams = queryParams;
        this.formattedQueryParams = this.formatParams(queryParams);
        this.queryParams.forEach((param)=>{
            this.queryParamKeys.push(param.name);
        });
        return this;
    }

    public setBodySchema(bodySchema :Array<RouteParam>) :Route {
        this.bodySchema = bodySchema;
        this.formattedBodySchema = this.buildSchema(bodySchema);
        return this;
    }

    public setExcludedEnvironments(environments :Array<string>) :Route {
        this.excludedEnvironments = environments;
        return this;
    }

    public setHideFromDocs(hideFromDocs :boolean) :Route {
        this.hideFromDocs = hideFromDocs;
        return this;
    }

    public setExampleResponse(exampleResponse :ApolloResponseType) :Route {
        this.exampleResponse = exampleResponse;
        return this;
    }

    public setIsDeprecated(value :boolean) :Route {
        this.isDeprecated = value;
        return this;
    }

    public getFormattedPathParams() :any {
        return this.formattedPathParams;
    }

    public getFormattedQueryParams() :any {
        return this.formattedQueryParams;
    }

    public getFormattedBodySchema() :any {
        return this.formattedBodySchema;
    }

    /**
     * A shortcut for determining if a route has
     * a specific query param configured for it.
     *
     * IT WILL NOT DETECT IF THE REQUEST HAS A QUERY
     * PARAM PRESENT
     *
     * @param {sting} key - the query param key to check
     * @return {boolean}
     */
    public hasQueryParam(key :string) :boolean {
        return this.queryParamKeys.includes(key);
    }

    private formatParams(queryParams :Array<RouteParam>) :any {
        return queryParams.map((param)=>{
            return this.formatParam(param);
        });
    }

    private buildSchema(level :Array<RouteParam>) :any {
        const schema :any = {};
        level.forEach((item)=>{
            schema[item.name] = this.buildBodySchemaLevel(item);
        });
        return schema;
    }

    private buildBodySchemaLevel(item :RouteParam) :any {
        let obj :any = {};
        if(item.children) {
            if(item.type === "object") {
                obj = this.buildSchema(item.children);
            }
            else{
                obj = [this.buildSchema(item.children)];
            }
        }
        else{
            obj = this.formatParam(item);
        }
        return obj;
    }

    private formatParam(item :RouteParam) :any {
        const obj = {
            name: item.name,
            description: item.description,
            required: item.required || false,
            type: item.type
        };
        if(item.type === "enum") {
            obj["enumValues"] = item.enumValues;
        }
        return obj;
    }
}
