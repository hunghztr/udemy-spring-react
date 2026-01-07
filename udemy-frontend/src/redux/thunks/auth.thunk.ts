import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ILogin, IRegister, IResult, IUserToken } from "../../type/auth.module";
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


export const loginWithInfo = createAsyncThunk(
  'auths/loginWithInfo',
  async ({ username, password }: ILogin, thunkApi) => {
    try {
      // Call login
      const tokenResponse = await thunkApi.dispatch(login({ username, password })).unwrap();

      api.defaults.headers.common['Authorization'] =
        `Bearer ${tokenResponse.data.result}`;

      const res: IApiResponse<IUserToken> = await api.get("/me");
      console.log(res)
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
export const refreshToken = createAsyncThunk(
  'auths/refreshToken',
  async (_,thunkApi) =>{
    try{
    const tokenRes : IApiResponse<IResult> = await api.post("/auth/refresh-token");
    const accessToken = tokenRes.data.result;
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    const userTokenRes : IApiResponse<IUserToken> = await api.get("/me");
    const user = userTokenRes.data;
    return {
      accessToken,user
    }
    }catch(err){
      const errAxios = err as AxiosError<IApiResponse<string>>;
      return thunkApi.rejectWithValue(errAxios.response?.data.message || "Invalid token"); 
    }
  }
)
export const logOut = createAsyncThunk(
  'auths/logOut',
  async (_,thunkApi) =>{
    try{
    await api.post("/logout");
    const user : IUserToken = {
      id : '',
      username:'',
      fullname:'',
      avatarPath:'',
      roleName:''
    }
    return {
      user
    }
  }catch(err){
    const errAxios = err as AxiosError<IApiResponse<string>>;
    return thunkApi.rejectWithValue(errAxios.response?.data.message || "Logout failed");
  }
  }
)
export const verifyMail = createAsyncThunk(
  'auths/verify-mail',
  async ({email} :{email : string},thunkApi) =>{
    try{
      await api.post("/auth/verify-mail",{
        email
      });
      localStorage.setItem("username",email);
    }catch(err){
      const errAxios = err as AxiosError<IApiResponse<string>>;
      return thunkApi.rejectWithValue(errAxios.response?.data.message || "Verify mail failed");
    }
  }
)
export const verifyOtp = createAsyncThunk(
  'auths/verify-otp',
  async ({email,value} : {email : string,value : string},thunkApi) =>{
    try{
      await api.post("/auth/verify-otp",{
        email,value
      })
  }catch(err){
    const errAxios = err as AxiosError<IApiResponse<string>>;
    return thunkApi.rejectWithValue(errAxios.response?.data.message || "Verify otp failed");
  }
  }
)
export const changePassword = createAsyncThunk(
  '/auths/changePass',
  async ({value} : {value : string},thunkApi) => {
      try{
        await api.post("/auth/change-password",{
          value
        });
      }catch(err){
        const errAxios = err as AxiosError<IApiResponse<string>>;
        return thunkApi.rejectWithValue(errAxios.response?.data.message || "change pass failed");
      }
  }
)