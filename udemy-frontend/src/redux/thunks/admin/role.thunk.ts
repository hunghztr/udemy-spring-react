import { createAsyncThunk } from "@reduxjs/toolkit";
import type { IApiResponse } from "../../../type/api.response";
import type { IRoleResponse } from "../../../type/role.module";
import api from "../../../api/api";
import type { IPagination, IPaginationResponse } from "../../../type/pagination";
import type { AxiosError } from "axios";

export const getAllRoles = createAsyncThunk(
    'roles/getAll',
    async ({page,size} : IPagination,thunkApi) =>{
        try{
            const res : IApiResponse<IPaginationResponse<IRoleResponse>> =
             await api.get(`/roles?page=${page}&size=${size}`);
            const elements = res.data.elements;
            const meta = res.data.meta;
            return {
                elements,meta
            }
        }catch(err){
            const axiosError = err as AxiosError<IApiResponse<string>>;
            return thunkApi.rejectWithValue(axiosError.response?.data.message||"roles is empty");
        }
    }
)