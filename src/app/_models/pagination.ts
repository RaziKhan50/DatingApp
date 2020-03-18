export interface Pagination {
   currentPage: number;
   itemsPerPage: number;
   totalItems: number;
   totalPages: number;
}
export class PagintedResult<T> {
    result: T;
    pagination: Pagination;
}
