export type PaginatedObject = {
    data :any;
    page: {
        size :number;
        prev :string;
        current :number;
        next :string;
    }
}

export type PaginationQuery = {
    limit :number;
    skip :number;
}

export type PaginationConfig = {
    /**
     * Max pageSize
     *  @default 25 
     * */
    max ?:number;
    
    /** @default 25 */
    pageSize ?:number;
}