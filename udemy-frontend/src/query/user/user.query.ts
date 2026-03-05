import type { IProfile, IUser, IUserDetailResponse, IUserResponse } from "@/type/user.module";
import { activate, create, getAll, getById, update } from "../api.crud.query";
import type { IPagination, } from "@/type/pagination";

export const updateProfile = (data: IProfile) => {
  return update<IProfile>({
    url: "/profiles",
    id: data.id ||"",
    data
  });
};
export const getProfile = (id : string) =>{
    return getById<IUserDetailResponse>({
        url:"/profiles",
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