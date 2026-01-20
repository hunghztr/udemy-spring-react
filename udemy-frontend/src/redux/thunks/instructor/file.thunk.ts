import { createAsyncThunk } from "@reduxjs/toolkit";
import type { IApiResponse, IResult } from "../../../type/api.response";
import api from "../../../api/api";
import { setUploadPercent } from "../../slices/file.slice";

export const uploadAvatar = createAsyncThunk(
    'files/uploadAvatar',
    async ({userId,formData} : {userId: string, formData: FormData},thunkApi) =>{
           const res : IApiResponse<IResult> = await api.post(`/files/avatars/${userId}`, formData, {
        onUploadProgress: (e) => {
          if (!e.total) return;
          const percent = Math.round((e.loaded * 100) / e.total);
          thunkApi.dispatch(setUploadPercent(percent));
        },
      });
        return res.data;
    }
)