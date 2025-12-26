import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ILogin, IRegister, IResult, IUserToken } from "../../type/user.module";
import api from "../../api/api";
import type { IApiResponse } from "../../type/api.response";
import type { AxiosError } from "axios";

export const login = createAsyncThunk(
  'auths/login',
  async ({ username, password }: ILogin, thunkApi) => {
    try {
      const res: IApiResponse<IResult> = await api.post("/auth/login", {
        username,
        password
      });
      return res;
    } catch (err: unknown) {
      const errAxios = err as AxiosError<IApiResponse<string>>;
      return thunkApi.rejectWithValue(errAxios.response?.data.message || "Login failed");
    }
  }
);

export const getInfo = createAsyncThunk(
  'auths/getInfo',
  async (_, thunkApi) => {
    try {
      const res: IApiResponse<IUserToken> = await api.get("/me");
      return res;
    } catch (err: unknown) {
      const errAxios = err as AxiosError<IApiResponse<string>>;
      return thunkApi.rejectWithValue(errAxios.response?.data.message || "Get info failed");
    }
  }
);

export const loginWithInfo = createAsyncThunk(
  'auths/loginWithInfo',
  async ({ username, password }: ILogin, thunkApi) => {
    try {
      // Call login
      const tokenResponse = await thunkApi.dispatch(login({ username, password })).unwrap();

      api.defaults.headers.common['Authorization'] =
        `Bearer ${tokenResponse.data.result}`;

      const res: IApiResponse<IUserToken> = await api.get("/me");
      return {
        user: res.data,
        accessToken: tokenResponse.data.result
      };
    } catch (err: unknown) {
      const errAxios = err as string;
      return thunkApi.rejectWithValue(errAxios || "LoginWithInfo failed");
    }
  }
);

export const loginGoogleWithInfo = createAsyncThunk(
  'auths/loginGoogleWithInfo',
  async (accessToken: string, thunkApi) => {
    try {
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      const res: IApiResponse<IUserToken> = await api.get("/me");
      return { user: res.data, accessToken };
    } catch (err: unknown) {
      const errAxios = err as AxiosError<IApiResponse<string>>;
      return thunkApi.rejectWithValue(errAxios.response?.data.message || "Google login failed");
    }
  }
);

export const register = createAsyncThunk(
  'auths/register',
  async ({username,password,fullname} : IRegister,thunkApi) =>{
    try{
    const res : IApiResponse<boolean> = await api.post("/auth/register",{
      username,password,fullname
    })
    return res.data;
  }catch(err){
    const errAxios = err as AxiosError<IApiResponse<string>>;
    return thunkApi.rejectWithValue(errAxios.response?.data.message)
  }
  }
)
export const refreskToken = createAsyncThunk(
  'auths/refreshToken',
  async (_,thunkApi) =>{
    try{
    const tokenRes : IApiResponse<IResult> = await api.post("/auth/refresh-token",
      {
        input : localStorage.getItem("username")
      });
    const accessToken = tokenRes.data.result;
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    const userTokenRes : IApiResponse<IUserToken> = await api.get("/me");
    const userToken = userTokenRes.data;
    return {
      accessToken,userToken
    }
    }catch(err){
      const errAxios = err as AxiosError<IApiResponse<string>>;
      return thunkApi.rejectWithValue(errAxios.response?.data.message || "Invalid token"); 
    }
  }
)