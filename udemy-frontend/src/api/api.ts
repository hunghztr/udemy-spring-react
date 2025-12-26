import axios from "axios";
import { PUBLIC_ENDPOINTS } from "../constants/public.endpoint";
import type { IToken } from "../type/token.module";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});


api.interceptors.request.use(
  (config) => {
    if (PUBLIC_ENDPOINTS.some(url => config.url?.includes(url))) {
      return config;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (PUBLIC_ENDPOINTS.some(url => originalRequest.url?.includes(url))) {
      return Promise.reject(error);
    }


    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const result : IToken = await api.post("/auth/refresh-token");
        const newAccessToken = result.accessToken;

        api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return api(originalRequest);

      } catch (refreshErr) {
        console.error("Refresh token failed:", refreshErr);
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
