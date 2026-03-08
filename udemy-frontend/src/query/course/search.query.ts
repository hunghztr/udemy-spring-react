import type { ICourseSearchResponse, IFilterRequest, IRecommendResponse } from "@/type/course.module"
import type { IPagination } from "@/type/pagination"
import { getAll, getAllNoPage, getById, remove } from "../api.crud.query"

export const searchFuzzi = ({data,filters} : {data: IPagination; filters: IFilterRequest|undefined}) =>{
    return getAll<ICourseSearchResponse>({
    url:"/client/search",
    pagination : data,
    filters
    })
}
export const getRecommend = () =>{
    return getAllNoPage<IRecommendResponse[]>({
        url:"/client/recommend"
    })
}
export const deleteHistory = (keyword:string) =>{
    return remove<boolean>({
        url:"/client/history",
        id : keyword
    })
}
export const getSuggest = (keyword:string) =>{
    return getById<IRecommendResponse[]>({
        url:`/client/suggest`,
        id:keyword
    })
}