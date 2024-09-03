export interface Paginate<T = any> {
    rows: T[];
    lastPage: number;
    nextPage: any;
    count: any;
    prevPage: null | number;
    currentPage: any;
}
