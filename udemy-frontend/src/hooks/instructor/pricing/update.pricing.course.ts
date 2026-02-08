import { query } from "@/main";
import { updatePrice } from "@/query/course/course.query";
import {  useSave } from "@/query/use.crud.query";
import type {  ICourse, ICourseDetailResponse } from "@/type/course.module";
import { showToast } from "@/utils/toast";
import { useEffect, useState } from "react";

export const useUpdatePricing = ({course} : {course:ICourseDetailResponse|null}) =>{
    const [price, setPrice] = useState<number>(0);

  /** ===== INIT ===== */
    useEffect(() => {
        if (course) {
        setPrice(course.price);
        }
    }, [course]);

    const { mutate: updateCoursePrice, isPending: isPriceUpdated } =
        useSave<boolean, { courseId: string; data: ICourse }>(
        "courses/update-price",
        updatePrice
        );

    /** ===== PRICE ===== */
    const handlePriceSave = () => {
        if (price <= 0) return showToast("Giá phải lớn hơn 0","error");

        updateCoursePrice(
        { courseId: course?.id || "", data: { price } },
        {
            onSuccess: () => {
            showToast("Cập nhật giá tiền thành công");
            query.invalidateQueries({queryKey:["courses/get-by-id"]});
            query.removeQueries({queryKey:["courses/search"],exact:false})
            },
        }
        );
    };

    return {price,setPrice,isPriceUpdated,handlePriceSave
    }
}