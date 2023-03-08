import { Request } from "express";

export type ParamDataTypes = "boolean"|"number"|"string"|"object"|"array"|"enum";

/**
 * Defines a route param for Sauce to pickup.
 * Could be a param in the path, body, or a query param
 *
 * @example
 * new RouteParam()
    .setName("startDate")
    .setType("string")
    .setDescription("ISO string of the start date of this thing")
    .setRequired(true)
    .setCustomValidator(someCustomValidator)
*/

export class RouteParam {
    public name :string;

    /** Children route params are typically used for structuring JSON bodies */
    public children :RouteParam[];
    public required :Boolean;
    public type :ParamDataTypes;
    public enumValues :Array<string | number | boolean>;
    public description :string;
    public customValidator ?:(requestParamValue :any, req :Request)=>void

    public setName(name :string) :RouteParam {
        this.name = name;
        return this;
    }
    public setChildren(children :Array<RouteParam>) :RouteParam {
        this.children = children;
        return this;
    }
    public setRequired(required :Boolean) :RouteParam {
        this.required = required;
        return this;
    }
    public setType(type :ParamDataTypes) :RouteParam {
        this.type = type;
        return this;
    }
    public setEnumValues(values :Array<string | number | boolean>) :RouteParam {
        this.enumValues = values;
        return this;
    }
    public setDescription(description :string) :RouteParam {
        this.description = description;
        return this;
    }

    /**
     * Set a custom validator on this route param
     * @param {Function} validator
     * @return {RouteParam}
     * @example
     *
        const isIsoDateParam = (requestParamValue :any, req :Request)=>{
            // This will enforce that the incoming string for the route param is indeed foramtted as an ISO string
            const errorRes = formatError(400, "Date string must be in ISO8601:2000 format");
            if (!/d{4}-d{2}-d{2}Td{2}:d{2}:d{2}.d{3}Z/.test(requestParamValue)) {
                throw errorRes;
            };
            const d = new Date(requestParamValue);
            const isValid = Date && !isNaN(d as any) && d.toISOString()===requestParamValue; // valid date
            if(!isValid) {
                throw errorRes;
            }
        };
     *
     * new RouteParam()
     * .setCustomValidator(isIsoDateParam)
     */
    public setCustomValidator(validator :(requestParamValue :any, req :Request)=>void) :RouteParam {
        this.customValidator = validator;
        return this;
    }
}
