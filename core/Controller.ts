import {Responses} from "./Responses";
import {RouteParam, ParamDataTypes} from "./routes/RouteParam";
import {formatError, asyncForEach} from "./utility";
import {Policies} from "./routes/Policies";
import { ApolloType } from "./Apollo";

export class Controller {
    protected responses :Responses;
    protected req;
    protected currentRoute;
    protected res;
    protected next;
    protected route;
    protected config;

    constructor(Apollo :ApolloType) {
        this.req = Apollo.req;
        this.currentRoute = Apollo.currentRoute;
        this.res = Apollo.res;
        this.next = Apollo.next;
        this.route = Apollo.currentRoute;
        this.config = Apollo.config;
        this.responses = new Responses(this.res);
    }

    public async checkPolicies() :Promise<void> {
        const policies = new Policies(this.config);
        if (this.route.policies) {
            await asyncForEach(this.route.policies, async policyName => {
                await policies.runPolicy(policyName);
            });
        }
    }

    public async runValidations() :Promise<void> {
        try {
            await Promise.all([
                this.validatePathParams(),
                this.validateQueryParams(),
                this.validateReqBody()
            ]);
        }
        catch(e) {
            throw e;
        }
    }

    private async validatePathParams() :Promise<RouteParam[]> {
        try {
            if(this.route.pathParams) {
                return asyncForEach(this.route.pathParams, param => {
                    const pathParam = this.req.params[param.name];
                    this.validatePathParamType(param, pathParam);
                    this.req.params[param.name] = this.convertType(param.type, pathParam);
                });
            }
        }
        catch(e) {
            throw e;
        }
    }

    private async validateQueryParams() :Promise<RouteParam[]> {
        try{
            if(this.route.queryParams) {
                return asyncForEach(this.route.queryParams, param =>{
                    const queryParam = this.req.query[param.name];
                    this.validateRequiredParam(param, queryParam);

                    if(typeof queryParam != "undefined") {
                        this.validateParamType(param, queryParam);
                        this.req.query[param.name] = this.convertType(param.type, queryParam);
                        this.validateEnumParam(param, queryParam);
                    }
                });
            }
        }
        catch(e) {
            throw e;
        }
    }

    private async validateReqBody() :Promise<RouteParam[]> {
        try{
            if(this.route.bodySchema) {
                if(!this.req.body) {
                    throw formatError(400, "Payload is expected");
                }
                return this.validateReqBodyParams(this.route.bodySchema, null, this.req.body);
            }
        }
        catch(e) {
            throw e;
        }
    }

    private async validateReqBodyParams(schema :RouteParam[], ancestor ?:RouteParam, obj ?:any) :Promise<RouteParam[]> {
        return asyncForEach(schema, param =>this.validateReqBodyParam(param, ancestor, obj));
    }

    private async validateReqBodyParam(schemaLevel :RouteParam, ancestor ?:RouteParam, obj ?:any) :Promise<void> {
        if(ancestor) {
            if(Array.isArray(obj)) {
                await asyncForEach(obj, row=>this.processBodyReqRow(schemaLevel, row));
            }
            else{
                this.processBodyReqRow(schemaLevel, obj);
            }
        }
        else{
            this.processBodyReqRow(schemaLevel, this.req.body);
        }

        if(schemaLevel.children) {
            if(Array.isArray(obj)) {
                await asyncForEach(obj, row=>
                    this.validateReqBodyParams(schemaLevel.children, schemaLevel, row[schemaLevel.name])
                );
            }
            else{
                await this.validateReqBodyParams(schemaLevel.children, schemaLevel, obj[schemaLevel.name]);
            }
        }
    }

    private processBodyReqRow(schemaLevel :RouteParam, row ?:any) :void {
        this.validateRequiredParam(schemaLevel, row[schemaLevel.name]);
        if(typeof row[schemaLevel.name] != "undefined") {
            this.validateParamType(schemaLevel, row[schemaLevel.name]);
            row[schemaLevel.name] = this.convertType(schemaLevel.type, row[schemaLevel.name]);
        }
    }

    private validateRequiredParam(param :RouteParam, requestParam :any) :void {
        if(param.required && !requestParam) {
            const err = `${param.name} was not sent and is required`;
            throw formatError(400, err);
        }
    }

    private validateEnumParam(param :RouteParam, requestParam :any) :void {
        if(requestParam && param.type === "enum") {
            const filtered = param.enumValues.filter((val)=>
                val === requestParam
            );

            if(filtered.length === 0) {
                const err = `Invalid enum value for ${param.name}: ${requestParam}`;
                throw formatError(400, err);
            }
        }
    }

    private validateParamType(param :RouteParam, requestParam :any) :void {
        if(requestParam) {
            if(!this.isValidTypes(param.type, requestParam)) {
                const err = `Invalid param type for ${param.name}: Expected ${param.type} but got ${typeof requestParam}`;
                throw formatError(400, err);
            }
        }
    }

    private validatePathParamType(param :RouteParam, requestParam :any) :void {
        if(requestParam) {
            if(!this.isValidTypes(param.type, requestParam)) {
                const err = `${this.route.method.toString().toUpperCase()} ${this.req.path} is not a valid request path`;
                throw formatError(400, err);
            }
        }
    }

    private isValidTypes(type :ParamDataTypes, paramValue :any) :Boolean {
        let isValid :Boolean = true;
        switch(type) {
        case "boolean":
            try{
                const value = typeof paramValue == "string" ? this.parseBool(paramValue) : paramValue;
                if(typeof value !== "boolean") {
                    isValid = false;
                }
            }
            catch(e) {
                isValid = false;
            }
            break;

        case "number":
            if(isNaN(parseInt(paramValue))) {
                isValid = false;
            }
            break;

        case "object":
            if(!(typeof paramValue === "object")) {
                isValid = false;
            }
            break;

        case "string":
            if(typeof paramValue != "string") {
                isValid = false;
            }
            break;

        case "array":
            if(!Array.isArray(paramValue)) {
                isValid = false;
            }
            break;

        default:
            isValid = true;
        }

        return isValid;
    }

    private convertType(type :ParamDataTypes, paramValue :any) :any {
        switch(type) {
        case "boolean":
            return this.parseBool(paramValue);

        case "number":
            return (+paramValue);

        default:
            return paramValue;
        }
    }

    private parseBool(stringIn :string) :Boolean {
        try{
            if(stringIn === "false") {
                return false;
            }
            if(stringIn === "true") {
                return true;
            }
            throw Error("Invalid value supplied");
        }
        catch(e) {
            throw e;
        }
    }
}
