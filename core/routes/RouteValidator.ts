import {RouteParam, ParamDataTypes} from "../routes/RouteParam";
import {formatError, asyncForEach} from "../utility";
import {Policies, policyList} from "../routes/Policies";
import { ObjectOfAnything } from "../resources/Common";
import { Sauce } from "../Sauce";

export class RouteValidator<custom=ObjectOfAnything> {
    protected req :Sauce["req"];
    protected currentRoute :Sauce["currentRoute"];
    protected res :Sauce["res"];
    protected next :Sauce["next"];
    protected route :Sauce["currentRoute"];
    protected config :Sauce["config"];

    /**
     * @param {Sauce<custom>} Sauce instance of Sauce class.
     * @return {void}
     */
    constructor(protected Sauce :Sauce<custom>) {
        this.req = Sauce.req;
        this.currentRoute = Sauce.currentRoute;
        this.res = Sauce.res;
        this.next = Sauce.next;
        this.route = Sauce.currentRoute;
        this.config = Sauce.config;
    }

    /**
     * Checks the policies for the current route.
     * @param {policyList<custom>} policyList policies defined for the route.
     * @return {Promise<void>}
     */
    public async checkPolicies(policyList :policyList<custom>) :Promise<void> {
        const policies = new Policies<custom>(policyList);
        if (this.route.policies) {
            await asyncForEach(this.route.policies, async policyName => {
                await policies.runPolicy(policyName, this.Sauce);
            });
        }
    }

    /**
     * Runs validations for path, query and request body params.
     * @return {Promise<void>}
     */
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

    /**
     * Validates the path parameters.
     * @return {Promise<RouteParam[]>}
     */
    private async validatePathParams() :Promise<RouteParam[]> {
        try {
            if(this.route.pathParams) {
                return asyncForEach(this.route.pathParams, param => {
                    const pathParam = this.req.params[param.name];
                    this.validatePathParamType(param, pathParam);
                    this.req.params[param.name] = this.convertType(param.type, pathParam);
                    this.runCustomParamValidator(param, pathParam);
                });
            }
        }
        catch(e) {
            throw e;
        }
    }

    /**
     * Validates the query parameters.
     * @return {Promise<RouteParam[]>}
     */
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
                    this.runCustomParamValidator(param, queryParam);
                });
            }
        }
        catch(e) {
            throw e;
        }
    }

    /**
     * Validates the request body parameters.
     * @return {Promise<RouteParam[]>}
    */
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
        this.runCustomParamValidator(schemaLevel, row[schemaLevel.name]);
    }

    private runCustomParamValidator(param :RouteParam, requestParamValue :any) :void {
        if(param.customValidator) {
            param.customValidator(requestParamValue, this.req);
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

    private parseBool(stringIn :string) :boolean {
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
