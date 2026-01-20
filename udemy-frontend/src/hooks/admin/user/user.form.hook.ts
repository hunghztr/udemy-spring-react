import { useCallback, useEffect, useState } from "react";
import type { IRoleResponse } from "../../../type/role.module";
import { getAllRoles } from "../../../redux/thunks/admin/role.thunk";
import { useFormHook } from "../form.hook";
import { createUser, getUserDetail, updateUser } from "../../../redux/thunks/admin/user.thunk";
import type { IUser } from "../../../type/user.module";

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


    const {dispatch,handleCreate,handleUpdate,errorCreate,errorUpdate} = useFormHook<boolean>({
        errorNameCreate:"users/create",
        errorNameUpdate:"users/update",
        errorNameGet:"users/get",
        thunkMethodCreate:createUser,
        thunkMethodUpdate:updateUser,
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
    const fetchRoles = useCallback(async () =>{
        try{
            const res = await dispatch(getAllRoles({page:0,size:10,active:true,keyword:""})).unwrap();
            setRoleList(res.elements);
            if(res.elements && res.elements.length > 0){
                setRoleId(res.elements[0].id);
            }
        }catch{
            setRoleList(null);
        }
    },[]);
    const fetchUser = useCallback(async () =>{
        try{
            if(userId){
                const res = await dispatch(getUserDetail({id:userId})).unwrap();
                setUsername(res.username);
                setFullname(res.fullname);
                const role = roleList?.find(r => r.name === res.roleName);
                setRoleId(role?.id||"");
            }
        }catch(err){

        }
    },[userId])
    // effects
    useEffect(() =>{
        fetchRoles();
        fetchUser();
    },[userId])
    return {
        username, setUsername, fullname, setFullname, password, setPassword, roleId, setRoleId, roleList,
    handleCreateUser,handleUpdateUser,errorCreate,errorUpdate
    }
}