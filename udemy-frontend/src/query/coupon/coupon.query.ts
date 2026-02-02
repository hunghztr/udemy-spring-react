import type { ICouponResponse } from "@/type/course.module"
import { activate, create, getById, update } from "../api.crud.query"

export const createCoupon = ({data,courseId}:{data:ICouponResponse,courseId:string}) =>{
    return create<ICouponResponse,ICouponResponse>({
        url:`/instructor/coupons/${courseId}`,
        data
    })
}
export const getCouponsNoPage = async (courseId:string) =>{
        return getById<ICouponResponse[]>({
            url:`/instructor/coupons`,
            id:courseId
        })
}
export const deleteCoupon = ({id,courseId} : {id : string; courseId : string}) =>{
    return activate({
        url:`/instructor/coupons/${courseId}/delete`,
        id
    })
}
export const updateCoupon = ({data,courseId}:{data:ICouponResponse,courseId:string}) =>{
    return update<ICouponResponse>({
    url:`/instructor/coupons/${courseId}/update`,
    id:data.id || "",
    data
    });
}