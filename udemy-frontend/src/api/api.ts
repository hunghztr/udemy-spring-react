import axios from "axios";
import { store } from "../redux/store";
import { logOut } from "../redux/thunks/auth.thunk";
import { PUBLIC_ENDPOINTS } from "../constants/public.endpoint";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

/**
 * ======================
 * REQUEST INTERCEPTOR
 * ======================
 * - Gắn accessToken cho PRIVATE API
 */
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

/**
 * ======================
 * RESPONSE INTERCEPTOR
 * ======================
 * - 401 = token invalid / expired / revoked
 * - Logout luôn
 */
api.interceptors.response.use(
  response => response.data,
  error => {
    const status = error.response?.status;

    if (status === 401) {
      store.dispatch(logOut());
    }

    return Promise.reject(error);
  }
);

export default api;
