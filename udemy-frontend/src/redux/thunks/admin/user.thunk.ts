import type { IUser, IUserResponse } from "../../../type/user.module";
import { create, get, getAll, removeOrActive, update } from "./crud.thunk";

export const getAllUsers =  getAll<IUserResponse>(
  "users/getAll",
  "/admin/users"
);

export const createUser = create<IUser, boolean>(
    "users/create",
    "/admin/users"
)
export const updateUser = update<IUser, boolean>(
    "users/update",
    (data) => `/admin/users/${data.id}`
);

export const getUserDetail =  get<IUserResponse>(
  "users/getDetail",
  (id) => `/admin/users/${id}`
);

export const disableUser = removeOrActive<boolean>(
  "users/disable",
  (id) => `/admin/users/delete/${id}`
);

export const activateUser = removeOrActive<boolean>(
  "users/activate",
  (id) => `/admin/users/active/${id}`
);