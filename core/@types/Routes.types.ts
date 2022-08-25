import { ObjectOfAnything } from "../resources/Common";

export interface FormattedRouteParam {
    name :string
    description :string
    required :boolean
    type :string
    enumValues ?:string[]
}

interface FormattedBodySchema {
    [key :string] : FormattedRouteParam |
                    FormattedRouteParam[] |
                    FormattedBodySchema |
                    FormattedBodySchema[]
}

export interface FormattedRoute {
    method :string
    path :string
    controller :string
    action :string
    policies :string[]
    description ?:string
    isDeprecated :boolean
    pathParams ?:FormattedRouteParam[]
    queryParams ?:FormattedRouteParam[]
    bodySchema ?:FormattedBodySchema | FormattedBodySchema[]
    exampleResponse ?:ObjectOfAnything
}

export interface RouteGrouping{
    routes :FormattedRoute[]
    tag ?:string
}
