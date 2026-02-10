import type { IApiResponse } from "@/type/api.response";
import type { IPaginationResponse } from "@/type/pagination";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useGetAll = <Res>(
    key : string, apiFn : () => Promise<Res>,enabled = true
) => {
    return useQuery<Res>({
        queryKey : [key],
        queryFn : apiFn,
        enabled
    })
}

export const useSave = <Res, Req>(
  key: string,
  apiFn: (data: Req) => Promise<Res>
) => {
  return useMutation<Res, AxiosError<IApiResponse<string>>, Req>({
    mutationKey: [key],
    mutationFn: (data) => apiFn(data)
  });
};


export const useGetById = <Res>(
  key: string,
  apiFn: (id: string) => Promise<Res>,
  id: string,enabled = true
) => {
  return useQuery<Res>({
    queryKey: [key, id],
    queryFn: () => apiFn(id),
    enabled
  });
};

export const useGetPaging = <Res, Req>(
  key: string,
  apiFn: (param: Req) => Promise<IPaginationResponse<Res>>,
  param: Req
) => {
  return useQuery<IPaginationResponse<Res>,AxiosError<IApiResponse<string>>>({
    queryKey: [key, param],
    queryFn: () => apiFn(param),
  });
};
