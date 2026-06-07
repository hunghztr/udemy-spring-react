import type { IBank, IBankResponse, IProfile, IUser, IUserDetailResponse, IUserResponse, IWalletResponse } from "@/type/user.module";
import { activate, create, getAll, getById, update } from "../api.crud.query";
import type { IPagination } from "@/type/pagination";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { IApiResponse } from "@/type/api.response";
import api from "@/api/api";
import type { ICourseSearchResponse } from "@/type/course.module";

export const getRecommend = () =>{
    return useQuery({
        queryKey:['courses/get-recommend'],
        queryFn:async () =>{
            const res : IApiResponse<ICourseSearchResponse[]> = await api.get("/client/get-recommend");
            return res.data;
        }
    })
}

export const getWallet = (userId : string) =>{
    return getById<IWalletResponse>({
        url:`/admin/wallets`,
        id:userId
    })
}
export const getAllWallets = (params?: {
  startDate?: string;
  endDate?: string;
}) => {
  return getAll<IWalletResponse>({
    url: `/admin/wallets`,
    filters:params
  });
};
export const getPay = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ["pays/get", startDate, endDate],
    queryFn: async () => {
      const res: IApiResponse<IBankResponse> = await api.get(
        "/profiles/get-pay",
        {
          params: {
            startDate,
            endDate
          }
        }
      );
      return res.data;
    }
  });
};
export const connectWallet = () =>{
    return useMutation({
        mutationKey:['pays/connect'],
        mutationFn: async (data : IBank) =>{
            const res : IApiResponse<boolean> = await api.post("/profiles/wallet",data);
            return res.data;
        }
    })
}
export const updateProfile = (data: IProfile) => {
  return update<IProfile>({
    url: "/profiles",
    id: data.id ||"",
    data
  });
};
export const getProfile = (id : string) =>{
    return getById<IUserDetailResponse>({
        url:"/client/profiles",
        id
    })
}
export const updateUser = (data : IUser) =>{
    return update<IUser>({
    url:"/admin/users",
    id:data.id || "",
    data
    });
}
export const createUser = (data : IUser) =>{
    return create<IUser>({
        url:"/admin/users",
        data
    })
}
export const getAllUsers = (data : IPagination) =>{
    return getAll<IUserResponse>({
    url:"/admin/users",
    pagination : data
    })
}
export const getUserById = (id : string) =>{
    return getById<IUserResponse>({
    url:"/admin/users",
    id
    })
}
export const disableUser = (id : string) =>{
    return activate({
    url:"/admin/users/delete",
    id
    })
}
export const enableUser = (id : string) =>{
    return activate({
    url:"/admin/users/active",
    id
    })
}

export const getUserByCourse = (courseId : string) =>{
    return getById<IUserResponse>({
        url:`/admin/users/get-by-course`,
        id:courseId
    })
}
