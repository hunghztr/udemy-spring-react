import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import type { IPagination, IPaginationResponse } from "../../../type/pagination";
import type { IApiResponse } from "../../../type/api.response";
import api from "../../../api/api";


export const getAll = <T>(
  name: string,
  url: string,
  emptyMsg = "Data is empty"
) =>
  createAsyncThunk(
    name,
    async (params: IPagination, thunkApi) => {
      try {
        const { page, size, active, keyword } = params;

        const response : IApiResponse<IPaginationResponse<T>> = await api.get(
          `${url}?page=${keyword ? 0 : page}&size=${size}&active=${active}&keyword=${keyword}`
        );

        return response.data; 
      } catch (err) {
        const axiosErr = err as AxiosError<IApiResponse<string>>;
        return thunkApi.rejectWithValue(
          axiosErr.response?.data.message || emptyMsg
        );
      }
    }
  );
export const getAllNoPage = <T>(
  name: string,
  url: string,
  emptyMsg = "Data is empty"
) =>
  createAsyncThunk(
    name,
    async (_, thunkApi) => {
      try {

        const response : IApiResponse<T> = await api.get(
          `${url}`
        );

        return response.data; 
      } catch (err) {
        const axiosErr = err as AxiosError<IApiResponse<string>>;
        return thunkApi.rejectWithValue(
          axiosErr.response?.data.message || emptyMsg
        );
      }
    }
  );
export const create = <TReq, TRes = boolean>(
  name: string,
  url: string,
  errorMsg = "Create failed"
) =>
  createAsyncThunk<
    TRes,
    TReq,
    { rejectValue: string }>(name, async (data : TReq, thunkApi) => {
    try {
      const response : IApiResponse<TRes> = await api.post(url, data);
      return response.data; 
    } catch (err) {
      const axiosErr = err as AxiosError<IApiResponse<string>>;
      return thunkApi.rejectWithValue(
        axiosErr.response?.data.message || errorMsg
      );
    }
  });

export const update = <TReq, TRes = boolean>(
  name: string,
  urlBuilder: (data: TReq) => string,
  errorMsg = "Update failed"
) =>
  createAsyncThunk<
    TRes,
    TReq,
    { rejectValue: string }
  >(name, async (data, thunkApi) => {
    try {
      const url = urlBuilder(data);
      const response : IApiResponse<TRes> = await api.put(url, data);
      return response.data;
    } catch (err) {
      const axiosErr = err as AxiosError<IApiResponse<string>>;
      return thunkApi.rejectWithValue(
        axiosErr.response?.data.message || errorMsg
      );
    }
  });
export const get = <TRes>(
  name: string,
  urlBuilder: (id: string) => string,
  errorMsg = "Get detail failed"
) =>
  createAsyncThunk<
    TRes,
    { id: string },
    { rejectValue: string }
  >(name, async ({ id }, thunkApi) => {
    try {
      const response : IApiResponse<TRes> = await api.get(urlBuilder(id));
      return response.data;
    } catch (err) {
      const axiosErr = err as AxiosError<IApiResponse<string>>;
      return thunkApi.rejectWithValue(
        axiosErr.response?.data.message || errorMsg
      );
    }
  });

export const removeOrActive = <TRes = boolean>(
  name: string,
  urlBuilder: (id: string) => string,
  errorMsg = "Action failed"
) =>
  createAsyncThunk<
    TRes,
    { id: string },
    { rejectValue: string }
  >(name, async ({ id }, thunkApi) => {
    try {
      const response : IApiResponse<TRes> = await api.post(urlBuilder(id));
      return response.data;
    } catch (err) {
      const axiosErr = err as AxiosError<IApiResponse<string>>;
      return thunkApi.rejectWithValue(
        axiosErr.response?.data.message || errorMsg
      );
    }
  });