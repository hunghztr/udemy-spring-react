export interface IPagination{
    page : number,
    size : number,
    active? : boolean
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