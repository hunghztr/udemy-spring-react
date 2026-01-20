import { useCallback, useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import type { IMetaResponse, IPagination, IPaginationResponse } from "../../type/pagination";
import type { AsyncThunk } from "@reduxjs/toolkit";

interface IUseFetchHookProps<T> {
  errorName: string;
  thunkMethod: AsyncThunk<
    IPaginationResponse<T>,
    IPagination,
    any
  >;
}

export const useFetchHook = <T>({errorName,thunkMethod} : IUseFetchHookProps<T>) =>{
    // States
    const [data,setData] = useState<T[] | null>(null);
    const [page,setPage] = useState(1);
    const [size,] = useState(10);
    const [active,setActive] = useState<boolean>(true);
    const [keyword, setKeyword] = useState<string>("");
    const loading = useAppSelector(state => state.loading);
    const error = useAppSelector(state => state.error.errors[errorName || "global"]);
    const dispatch = useAppDispatch();
    const [meta,setMeta] = useState<IMetaResponse>({
        currentPage:1,
        pageSize:10,
        elementTotals:0,
        pageTotals:0
    });

    // effect
    useEffect(() =>{
      if(error){
        setMeta({...meta,elementTotals:0})
      }
    },[error])
    
    const fetchData = useCallback(async () => {
    try {
        const res = await dispatch(thunkMethod({ page:page-1, size, active, keyword })).unwrap();
        setData(res.elements);
        setMeta(res.meta);
    } catch (err) {
        setData(null);
    }
    }, [dispatch, thunkMethod, page, size, active, keyword]);
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleToggle = (
    _: React.MouseEvent<HTMLElement>,
    newValue: boolean | null
  ) => {
    if (newValue !== null) setActive(newValue);
  };
    return {
        data,page,active,handleToggle,keyword,setKeyword,loading,error,setPage,meta,fetchData
    }
}