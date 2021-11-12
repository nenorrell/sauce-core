import {Route} from '../routes/Route';
import {PaginationConfig} from './PaginationTypes';

type PolicyFunctions = {
    [key :string] :Function
};

type Policies<T> = {
    [key in keyof T] :Function // eslint-disable-line no-unused-vars
};

export interface ApolloConfig<PolicyOptions=PolicyFunctions> {
    environments :Record<string, {url :string}>

    /** Your app routes */
    routes :Route[]

    /** Route policy definitions */
    policies ?:Policies<PolicyOptions>

    /** Customize Apollo's built in config */
    pagination ?:PaginationConfig
}
