import type { IPagination } from "@/type/pagination";
import type { IRoleResponse } from "@/type/role.module";
import { getAll } from "../api.crud.query";

export const getAllRoles = (data : IPagination) =>{
    return getAll<IRoleResponse>({
        url:"/admin/roles",
        pagination : data
    })
}