import api from "@/api/api";
import type { IApiResponse } from "@/type/api.response";
import { type ICategoryStudentResponse, type ICategory, type ICategoryCourseResponse, type ICategoryParentResponse, type ICategoryResponse } from "@/type/category.module";
import type { IPagination, IPaginationResponse } from "@/type/pagination";
import { activate, create, getAll, getAllNoPage, getById, update } from "../api.crud.query";
import type { ICourseSearchResponse, IFilterRequest } from "@/type/course.module";
import { useQuery } from "@tanstack/react-query";

export const getCategoriesParent = async () =>{
        const res : IApiResponse<IPaginationResponse<ICategoryParentResponse>> =
         await api.get("/client/categories/get-all-parents?active=true&keyword=");
         return res.data
}
export const getCategoiesChild = async () =>{
        const res : IApiResponse<ICategoryCourseResponse[]> =
         await api.get("/client/categories/get-all-children");
         return res.data
}
export const getCategoriesNoPage = async () =>{
        return getAllNoPage<ICategoryResponse[]>({
            url:`/instructor/courses/categories/no-page`
        })
}

export const getCategoriesByDash = async () =>{
    return getAllNoPage<ICategoryCourseResponse[]>({
        url:`/admin/dashboard/get-categories`
    })
}
export const updateCategory = (data : ICategory) =>{
    return update<ICategory>({
    url:"/admin/categories",
    id:data.id || "",
    data
    });
}
export const createCategory = (data : ICategory) =>{
    return create<ICategory>({
        url:"/admin/categories",
        data
    })
}
export const getAllCategories = (data : IPagination) =>{
    return getAll<ICategoryResponse>({
    url:"/admin/categories",
    pagination : data
    })
}
// export const getAllCategoriesNoPage = () =>{
//     return getAllNoPage<ICategoryResponse[]>({
//         url:"/instructor/categories/no-page"
//     })
// }
export const getCategoryById = (id : string) =>{
    return getById<ICategoryResponse>({
    url:"/admin/categories",
    id
    })
}
export const getByMonths = async(categoryId : string) =>{
        return getById<ICategoryStudentResponse[]>({
            url: `/admin/dashboard/get-student-by-months`,
            id:categoryId
        })
}
export const disableCategory = (id : string) =>{
    return activate({
    url:"/admin/categories/delete",
    id
    })
}
export const enableCategory = (id : string) =>{
    return activate({
    url:"/admin/categories/active",
    id
    })
}

export const getCoursesByCategory = ({id,data,filters} : {id:string,data:IPagination,filters?: IFilterRequest}) =>{
    return useQuery<IPaginationResponse<ICourseSearchResponse>>({
        queryKey : ["courses-by-category",id,data,filters],
        queryFn : () => api.get(`/client/get-courses-by-category/${id}`,{
            params : {
                page : data.page,
                size : data.size,
                ...filters
            }
        })
        .then(res => res.data)
    })
}