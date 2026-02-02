import type { IRoleResponse } from "@/type/role.module";
import {  useEffect, useState } from "react";
import { useFormHook } from "../form.hook";
import {type IUser, type IUserResponse } from "@/type/user.module";
import {  createUser, getUserById, updateUser } from "@/query/user/user.query";
import { useGetById, useGetPaging } from "@/query/use.crud.query";
import type { IPagination } from "@/type/pagination";
import { getAllRoles } from "@/query/role/role.query";


interface IUseFormHookProps{
    userId?: string;
}
export const useUserFormHook =  ({userId}
     : IUseFormHookProps) =>{
    const [username,setUsername] = useState<string>("");
    const [fullname,setFullname] = useState<string>("");
    const [password,setPassword] = useState<string>("");
    const [roleId,setRoleId] = useState<string>("");
    const [roleList,setRoleList] = useState<IRoleResponse[] | null>(null);
    const {error:getError,data,isLoading:isLoadingUser} = useGetById<IUserResponse>(
        'users/get-by-id',getUserById,userId || ""
    )
    const {data:roleData,isLoading:isLoadingRole} = useGetPaging<IRoleResponse,IPagination>(
        'roles/get-all',getAllRoles,{page:0,size:10,active:true,keyword:""}
    )
    useEffect(() =>{
        if(roleData?.elements && !isLoadingRole){
            setRoleList(roleData.elements);
            setRoleId(roleData.elements[0]?.id);
        }
    },[roleData])
    useEffect(() =>{
        if(data && !isLoadingUser){
            setUsername(data.username);
            setFullname(data.fullname);
            const role = roleList?.find(r => r.name === data.roleName);
            setRoleId(role?.id||"");
        }
    },[data])

    const {handleCreate,handleUpdate,errorCreate,errorUpdate} = useFormHook<IUser>({
        mutationCreate:"users/create",
        mutationUpdate:"users/update",
        createData: createUser,
        updateData: updateUser
    });
    const handleCreateUser = async () =>{
        const res = await handleCreate<IUser>({username,password,fullname,role:{id:roleId}});
        if(res){
            setUsername("");
            setFullname("");
            setPassword("");
        }
        return res;
    }
    const handleUpdateUser = async (id : string) =>{
        const res = await handleUpdate<IUser>({id,username,fullname,role:{id:roleId}});
        if(res){
            setUsername("");
            setFullname("");
        }
        return res;
    }
  
    return {
        username, setUsername, fullname, setFullname, password, setPassword, roleId, setRoleId, roleList,
    handleCreateUser,handleUpdateUser,errorCreate,errorUpdate,getError
    }
}