import { Request } from "express";

export type ParamDataTypes = "boolean"|"number"|"string"|"object"|"array"|"enum";

export type ParamValidator = (paramConfig :RouteParam, requestParamValue :any, req :Request)=>void;
/**
 * Defines a route param for Apollo to pickup.
 * Could be a param in the path, body, or a query param */
export class RouteParam {
    public name :string;
    public children :RouteParam[];
    public required :Boolean;
    public type :ParamDataTypes;
    public enumValues :Array<string | number | boolean>;
    public description :string;
    public customValidator ?:ParamValidator

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
    public setCustomValidator(validator :ParamValidator) :RouteParam {
        this.customValidator = validator;
        return this;
    }
}
