import api from "@/api/api";
import type { IApiResponse } from "@/type/api.response";
import type { ICategory, ICategoryParentResponse, ICategoryResponse } from "@/type/category.module";
import type { IPagination, IPaginationResponse } from "@/type/pagination";
import { activate, create, getAll, getAllNoPage, getById, update } from "../api.crud.query";

export const getCategoriesParent = async () =>{
        const res : IApiResponse<IPaginationResponse<ICategoryParentResponse>> =
         await api.get("/client/categories/get-all-parents?active=true&keyword=");
         return res.data
}

export const getCategoriesNoPage = async () =>{
        const res : IApiResponse<ICategoryParentResponse[]> =
         await api.get("/admin/categories/no-page");
         return res.data;
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
export const getAllCategoriesNoPage = () =>{
    return getAllNoPage<ICategoryResponse[]>({
        url:"/admin/categories/no-page"
    })
}
export const getCategoryById = (id : string) =>{
    return getById<ICategoryResponse>({
    url:"/admin/categories",
    id
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
