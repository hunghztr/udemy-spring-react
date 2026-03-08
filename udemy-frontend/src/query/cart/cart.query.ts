import { type ICartResponse } from "@/type/cart.module"
import { create, getAllNoPage, remove } from "../api.crud.query"
import type { IApiResponse } from "@/type/api.response"
import api from "@/api/api"

export const addToCart = (courseId : string) =>{
    return create<{courseId : string}>({
        url:`/client/carts/${courseId}`,
    })
}
export const getCart = () =>{
    return getAllNoPage<ICartResponse>({
        url: `/client/carts`
    })
}
export const deleteFromCart = (courseId : string) =>{
    return remove({
        url: `/client/carts`,
        id: courseId
    })
}
export const getSalePrice = async ({courseId,code} : {courseId : string, code : string}) =>{
    const res : IApiResponse<number> = await api.get(`/client/carts/${courseId}/discount/${code}`);
    return res.data;
}