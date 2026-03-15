import { type ICartResponse } from "@/type/cart.module"
import { create, getAllNoPage, getById, remove } from "../api.crud.query"


export const addToCart = (courseId : string) =>{
    return create<{courseId : string}>({
        url:`/carts/${courseId}`,
    })
}
export const getCart = () =>{
    return getAllNoPage<ICartResponse>({
        url: `/carts`
    })
}
export const deleteFromCart = (courseId : string) =>{
    return remove({
        url: `/carts`,
        id: courseId
    })
}
export const getSalePrice = async ({courseId,code} : {courseId : string, code : string}) =>{

    return getById<number>({
        url: `/carts/${courseId}/discount`,
        id:code
    })
}