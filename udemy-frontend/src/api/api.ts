import { PUBLIC_ENDPOINTS } from "@/constants/public.endpoint";
import { store } from "@/redux/store";
import { getMe, logOut, refreshToken } from "@/redux/thunks/auth.thunk";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});


api.interceptors.request.use(
  config => {
    const isPublic = PUBLIC_ENDPOINTS.some(url =>
      config.url?.includes(url)
    );

    if (!isPublic) {
      const accessToken = store.getState().auth.accessToken;
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }else{
      delete config.headers.Authorization;
    }

    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => response.data,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await store.dispatch(refreshToken()).unwrap();
        originalRequest.headers.Authorization = `Bearer ${res.accessToken}`;
        await store.dispatch(getMe()).unwrap();
        return api(originalRequest);
      } catch (e) {
        store.dispatch(logOut());
      }
    }

    return Promise.reject(error);
  }
);

export default api;
