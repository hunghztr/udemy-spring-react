export interface IPagination{
    page : number,
    size : number,
    active? : boolean,
    keyword? : string
}
export interface IPaginationResponse<T>{
    elements : T[],
    meta : IMetaResponse
}
export interface IMetaResponse{
    currentPage : number,
    pageSize : number,
    elementTotals : number,
    pageTotals : number,
}