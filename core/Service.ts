import {Apollo} from './Apollo';
import {PaginatedObject, PaginationQuery, PaginationConfig} from './resources/PaginationTypes';
import {getAppUrl, formatError} from './utility';

export class Service {
    private config = Apollo.config
    protected req = Apollo.req;
    protected res = Apollo.res;
    protected next = Apollo.next;
    protected currentRoute = Apollo.currentRoute;
    protected paging :PaginationConfig & {page :number} = {
        page: 1,
        pageSize: Apollo.config.pagination?.pageSize || 25,
        max: Apollo.config.pagination?.max || 50
    };

    public routeHasPagination() :boolean {
        return this.currentRoute.hasQueryParam('page') && this.currentRoute.hasQueryParam('pageSize');
    }

    public buildPaginationQuery() :PaginationQuery {
        if(this.routeHasPagination()) {
            this.paging.page = <any>this.req.query['page'] || this.paging.page;
            this.paging.pageSize = <any>this.req.query['pageSize'] || this.paging.pageSize;

            if(this.paging.pageSize > this.paging.max) {
                throw formatError(400, `Page size can not exceed ${this.paging.max}`);
            }

            return {
                limit: this.paging.pageSize,
                skip: (this.paging.page - 1) * this.paging.pageSize
            };
        }

        throw new Error('Pagination params not configured for this route');
    }

    public paginate(data :any[]) :PaginatedObject {
        const host = getAppUrl(this.config);
        const url = `${host}${this.req.path}`;
        const queryKeys = this.currentRoute.queryParamKeys;

        let args = '';
        for(let i=0; i<queryKeys.length; i++) {
            const param = queryKeys[i];
            if(param !== 'page' && param !== 'pageSize') {
                if(this.req.query[param]) {
                    args += `${param}=${this.req.query[param]}&`;
                }
            }
        }

        const next = data.length < this.paging.pageSize ? '' : `${url}?${args}page=${this.paging.page+1}&pageSize=${this.paging.pageSize}`;
        const prev = this.paging.page == 1 ? '' : `${url}?${args}page=${this.paging.page-1}&pageSize=${this.paging.pageSize}`;

        return {
            data,
            page: {
                size: this.paging.pageSize,
                prev: prev,
                current: this.paging.page,
                next: next
            }
        };
    }
}
