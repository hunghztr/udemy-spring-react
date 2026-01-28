import api from "@/api/api";
import type { IApiResponse } from "@/type/api.response";
import type { IPagination, IPaginationResponse } from "@/type/pagination";


export const getAll = async <Res>({
  url,pagination
} : {url : string; pagination: IPagination}) =>{
  const res : IApiResponse<IPaginationResponse<Res>> = await api.get(
    `${url}?page=${pagination.keyword ? 0 : pagination.page}&size=${pagination.size}&active=${pagination.active}&keyword=${pagination.keyword}`
  );
  return  res.data;
}
export const getAllNoPage = async <Res>({
  url
} : {url : string}) =>{
  const res : IApiResponse<Res> = await api.get(`${url}`);
  return res.data;
}
export const getById = async <Res>({
  url,id
} : {url : string; id: string}) =>{
  const res : IApiResponse<Res> = await api.get(
    `${url}/${id}`
  );
  return  res.data;
}
export const create = async <Req,Res=boolean>({
  url,
  data
} : {url : string; data: Req}) =>{
  const res : IApiResponse<Res> = await api.post(url, data);
  return  res.data;
}
export const update = async <Req,Res = boolean>({
  url,
  id,
  data
} : {url : string; id: string; data: Req}) =>{
  const res : IApiResponse<Res> = await api.put(
    `${url}/${id}`, data);
  return  res.data;
}
export const activate = async <Res = boolean> ({
  url, id
} : {url : string; id: string}) =>{
  const res : IApiResponse<Res> = await api.post(`${url}/${id}`);
  return  res.data;
}