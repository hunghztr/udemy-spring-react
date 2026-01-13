export interface ICategoryResponse{
    id : string,
    name : string,
    categoryParent : ICategoryResponse | null
}
