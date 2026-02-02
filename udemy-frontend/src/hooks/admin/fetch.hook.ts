import {  useEffect, useState } from "react"
import type { IMetaResponse, IPagination, IPaginationResponse } from "@/type/pagination";
import { useGetPaging } from "@/query/use.crud.query";

interface IUseFetchHookProps<Res> {
  fetchMethod: (data : IPagination) => Promise<IPaginationResponse<Res>>;
  queryName?: string;
}

export const useFetchHook = <Res>({fetchMethod, queryName} : IUseFetchHookProps<Res>) =>{
    // States
    const [data,setData] = useState<Res[] | null>(null);
    const [page,setPage] = useState(1);
    const [size,] = useState(10);
    const [active,setActive] = useState<boolean>(true);
    const [keyword, setKeyword] = useState<string>("");
    const [meta,setMeta] = useState<IMetaResponse>({
        currentPage:1,
        pageSize:10,
        elementTotals:0,
        pageTotals:0
    });
    const {data:newData,isLoading,refetch} = useGetPaging<Res,IPagination>(
      queryName ||"fetch/data",
      fetchMethod,
      {page:page-1,size,active,keyword}
    )
    useEffect(() =>{
      if(!isLoading && newData){
        setData(newData.elements);
        setMeta(newData.meta);
      }
    },[isLoading,newData])

    useEffect(() =>{
      setPage(1);
      refetch();
    },[active])

    

    // effect
    useEffect(() =>{
      if(!newData || newData.elements.length === 0){
        setMeta({...meta,elementTotals:0})
      }
    },[newData])

    const handleToggle = (
    _: React.MouseEvent<HTMLElement>,
    newValue: boolean | null
  ) => {
    if (newValue !== null) setActive(newValue);
  };
    return {
        data,page,active,handleToggle,keyword,setKeyword,isLoading,setPage,meta,refetch
    }
}