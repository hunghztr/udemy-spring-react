import { query } from "@/main";
import { createCoupon, deleteCoupon, getCouponsNoPage, updateCoupon } from "@/query/coupon/coupon.query";
import { useGetById, useSave } from "@/query/use.crud.query";
import type { ICouponResponse, ICourseDetailResponse } from "@/type/course.module";
import { useEffect, useState } from "react";

export const useUpdateCoupon = ({course} : {course:ICourseDetailResponse|null}) =>{
    const [openAdd, setOpenAdd] = useState(false);
    const [openCoupons, setOpenCoupons] = useState(false);
    const [coupons, setCoupons] = useState<ICouponResponse[]>([]);
    /** ===== INIT ===== */
    useEffect(() => {
        if (course) {
        setCoupons(course.coupons || []);
        }
    }, [course]);
   /** ===== EDIT STATE ===== */
    const [editingCouponId, setEditingCouponId] = useState<string | null>(null);
    const [draftCoupon, setDraftCoupon] =
    useState<ICouponResponse | null>(null);

    const isValidDraftCoupon =
    !!draftCoupon &&
    draftCoupon.code.trim().length > 0 &&
    draftCoupon.discount >= 1 &&
    draftCoupon.discount <= 100;

    const [newCoupon, setNewCoupon] = useState<ICouponResponse>({
        code: "",
        discount: 0,
    });
/** ===== API ===== */
    const { mutate: create, isPending: isCreated } = useSave<
        ICouponResponse,
        { data: ICouponResponse; courseId: string }
    >("coupons/create", createCoupon);

    const { mutate: deleteElement } = useSave<
        boolean,
        { id: string; courseId: string }
    >("coupons/delete", deleteCoupon);

    const { data } = useGetById<ICouponResponse[]>(
        "coupons/get-all-by-course",
        getCouponsNoPage,
        course?.id || ""
    );

    const { mutate: updateElement } = useSave<
        boolean,
        { courseId: string; data: ICouponResponse }
    >("coupons/update", updateCoupon);
    useEffect(() => {
        if (data) setCoupons(data);
    }, [data]);

    // handle 
/** ===== ADD ===== */
    const isValidNewCoupon =
        newCoupon.code.trim().length > 0 &&
        newCoupon.discount >= 1 &&
        newCoupon.discount <= 100;

    const handleAdd = () => {
        if (!course?.id) return;

        create(
        { data: newCoupon, courseId: course.id },
        {
            onSuccess: () => {
            setNewCoupon({ code: "", discount: 0 });
            setOpenAdd(false);
            query.invalidateQueries({queryKey:["courses/get-by-id"]});
            },
        }
        );
    };

    /** ===== DELETE ===== */
    const handleDeleteCoupon = (id: string) => {
        deleteElement(
        { id, courseId: course?.id || "" },
        { onSuccess: () => query.invalidateQueries({queryKey:["courses/get-by-id"]}) }
        );
    };
/** ===== EDIT ===== */
    const startEditCoupon = (coupon: ICouponResponse) => {
        setEditingCouponId(coupon.id || null);
        setDraftCoupon({ ...coupon });
    };

    const cancelEditCoupon = () => {
        setEditingCouponId(null);
        setDraftCoupon(null);
    };

    const saveEditCoupon = (id: string) => {
        if (!isValidDraftCoupon) return;

        updateElement(
        {
            courseId: course?.id || "",
            data: {
            id,
            code: draftCoupon!.code,
            discount: draftCoupon!.discount,
            },
        },
        {
            onSuccess: () => {
            query.invalidateQueries({queryKey:["courses/get-by-id"]});
            query.removeQueries({queryKey:["courses/search"],exact:false})
            cancelEditCoupon();
            },
        }
        );
    };
    return {
        coupons,setOpenCoupons,openCoupons,
        setOpenAdd,editingCouponId,draftCoupon,setDraftCoupon,isValidDraftCoupon,saveEditCoupon,
        cancelEditCoupon,startEditCoupon,handleDeleteCoupon,openAdd,
        newCoupon,setNewCoupon,isValidNewCoupon,isCreated,handleAdd,
    }
}