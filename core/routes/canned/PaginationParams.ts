import {RouteParam} from "../RouteParam";

/**
 * @deprecated please use getPaginatedParams() instead of PaginationParams.
 * PaginationParams will be removed in a future release
*/
export const PaginationParams = [
    new RouteParam()
        .setName("pageSize")
        .setDescription("The amount of items to return for each page")
        .setType("number")
        .setRequired(false),

    new RouteParam()
        .setName("page")
        .setType("number")
        .setRequired(false)
        .setDescription("The page number you're requesting")
];

export const getPaginationParams = (max ?:number) => {
    return [
        new RouteParam()
            .setName("pageSize")
            .setDescription(`The amount of items to return for each page (max ${max || 50})`)
            .setType("number")
            .setRequired(false),

        new RouteParam()
            .setName("page")
            .setType("number")
            .setRequired(false)
            .setDescription("The page number you're requesting")
    ];
};
