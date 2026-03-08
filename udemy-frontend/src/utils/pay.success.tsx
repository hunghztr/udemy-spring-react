import api from "@/api/api";
import Loading from "@/components/loading";
import type { IApiResponse } from "@/type/api.response";
import { useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"

export default function PaySuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tran = searchParams.get("vnp_BankTranNo");
  const fetch = useCallback(async () =>{
    const paymentCourses =
      JSON.parse(localStorage.getItem("payment_courses") || "[]");
    const res : IApiResponse<boolean> = await api.post("/payments",
      paymentCourses
    );
    if(res.data){
      localStorage.removeItem("payment_courses");
      navigate("/payment-success");
    }
  },[tran])
  useEffect(() =>{
    fetch();
  },[])
  return (
    <Loading />
  )
}
