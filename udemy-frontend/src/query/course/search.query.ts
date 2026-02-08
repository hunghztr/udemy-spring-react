import type { ICourseSearchResponse } from "@/type/course.module"
import type { IPagination } from "@/type/pagination"
import { getAll, getAllNoPage, remove } from "../api.crud.query"

export const searchFuzzi = (data : IPagination) =>{
    return getAll<ICourseSearchResponse>({
    url:"/client/search",
    pagination : data
    })
}
export const getHistory = () =>{
    return getAllNoPage<string[]>({
        url:"/client/history"
    })
}
export const deleteHistory = (keyword:string) =>{
    return remove<boolean>({
        url:"/client/history",
        id : keyword
    })
}