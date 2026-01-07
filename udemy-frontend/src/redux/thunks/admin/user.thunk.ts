import { createAsyncThunk } from "@reduxjs/toolkit";
import type {  IPagination, IPaginationResponse } from "../../../type/pagination";
import api from "../../../api/api";
import type { IUser, IUserDetailResponse, IUserResponse } from "../../../type/user.module";
import type { AxiosError } from "axios";
import type { IApiResponse } from "../../../type/api.response";

export const getAllUsers = createAsyncThunk(
    'users/getAll',
    async ({page,size,active} : IPagination,thunkApi) =>{
        try{

            const response : IApiResponse<IPaginationResponse<IUserResponse>> = 
            await api.get(`/users?page=${page}&size=${size}&active=${active}`);
            const meta = response.data.meta;
            const elements = response.data.elements;
            return{
                meta,
                elements
            }
        }catch(err){
            const axiosErr = err as AxiosError<IApiResponse<string>>;
            console.log(axiosErr)
            return thunkApi.rejectWithValue(axiosErr.response?.data.message || "users is empty");
        }
    }
)
export const createUser = createAsyncThunk(
    'users/create',
    async ({username,password,fullname,role} : IUser,thunkApi) =>{
        try{
            const res : IApiResponse<boolean> = await api.post("/users",{
                username,password,fullname,role
            });
            return res.data;
        }catch(err){
            const errAxios = err as AxiosError<IApiResponse<string>>;
            return thunkApi.rejectWithValue(errAxios.response?.data.message||"create user failed");
        }
    }
)
export const updateUser = createAsyncThunk(
    'users/update',
    async ({id,username,password,fullname,role} : IUser,thunkApi) => {
        try{
            const res : IApiResponse<boolean> = await api.put(`/users/${id}`,{
                username,password,fullname,role
            });
            return res.data;
        }catch(err){
            const errAxios = err as AxiosError<IApiResponse<string>>;
            return thunkApi.rejectWithValue(errAxios.response?.data.message||"update user failed");
        }
    }
)
export const getDetailUser = createAsyncThunk(
    'users/getDetail',
    async ({id} : {id : string},thunkApi) =>{
        try{
            const res : IApiResponse<IUserDetailResponse> = await api.get(`/users/${id}`)
            return res.data;
        }catch(err){
            const errAxios = err as AxiosError<IApiResponse<string>>;
            return thunkApi.rejectWithValue(errAxios.response?.data.message||"get detail user failed");
        }
    }
)

export const deleteUser = createAsyncThunk(
    'users/delete',
    async ({id} : {id : string},thunkApi) =>{
        try{
            const res : IApiResponse<boolean> = await api.post(`/users/delete/${id}`);
            return res.data;
        }catch(err){
            const errAxios = err as AxiosError<IApiResponse<string>>;
            return thunkApi.rejectWithValue(errAxios.response?.data.message||"delete user failed");
        }
    }
)
export const activeUser = createAsyncThunk(
    'users/active',
    async({id} : {id : string},thunkApi) =>{
        try{
            const res : IApiResponse<boolean> = await api.post(`/users/active/${id}`);
            return res.data;
        }catch(err){
            const errAxios = err as AxiosError<IApiResponse<string>>;
            return thunkApi.rejectWithValue(errAxios.response?.data.message||"active user failed");
        }
    }
)