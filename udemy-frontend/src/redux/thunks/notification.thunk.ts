import api from "@/api/api";
import type { IApiResponse, ISliceResponse } from "@/type/api.response";
import type { INotificationResponse } from "@/type/notification.module";
import type { IPagination } from "@/type/pagination";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";

export const getNotifications = createAsyncThunk(
    'notifications/get-all',
    async ({page,size} : IPagination,thunkApi) =>{
        try{
            const res : IApiResponse<ISliceResponse<INotificationResponse>>= await api.get
            (`/notifications`,{
                params:{
                    page,size
                }
            });
            return res.data
        }catch(err){
            const axiosErr = err as AxiosError<IApiResponse<string>>;
            return thunkApi.rejectWithValue(axiosErr.response?.data.message||"Error occurr")
        }
    }
)
export const markNotification = createAsyncThunk(
    'notifications/mark',
    async (id:string,thunkApi) =>{
        try{
            await api.post(`/notifications/${id}`)
            return id;
        }catch(err){
            const errAxios = err as AxiosError<IApiResponse<string>>;
            return thunkApi.rejectWithValue(errAxios.response?.data.message||"error occurr");
        }
    }
)