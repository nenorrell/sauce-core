import {RouteParam} from '../RouteParam';

export const PaginationParams = [
    new RouteParam()
        .setName('pageSize')
        .setDescription('The amount of items to return for each page (max 50)')
        .setType('number')
        .setRequired(false),

    new RouteParam()
        .setName('page')
        .setType('number')
        .setRequired(false)
        .setDescription('The page number you\'re requesting')
];
