import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import type { IRoleResponse } from "../../type/role.module";
import { showToast } from "../../utils/toast";
import { getAllRoles } from "../../redux/thunks/admin/role.thunk";
import { activeUser, createUser, deleteUser, getDetailUser, updateUser } from "../../redux/thunks/admin/user.thunk";
import type {IUserDetailResponse } from "../../type/user.module";

export const useSaveUserHook = () =>{
    const createError = useAppSelector(state => state.error.errors['users/create']);
    const updateError = useAppSelector(state => state.error.errors['users/update']);
    const dispatch = useAppDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [roleList,setRoleList] = useState<IRoleResponse[]|null>(null)
  const [fullname, setFullname] = useState("");
  const [roleId,setRoleId] = useState("");
  const [selectedUser,setSelectedUser] = useState<IUserDetailResponse|null>(null);
  const [selectedUserId,setSelectedUserId] = useState<string>("");
  const [success,setSuccess] = useState<boolean>(false);
  // lấy chi tiết user khi có selectedUserId
    useEffect(() =>{
        const fetch = async () =>{
            try{
                    const res = await dispatch(getDetailUser({id:selectedUserId})).unwrap();
                        setSelectedUser(res);
                        setUsername(res.username);
                        setFullname(res.fullname);
                        const newRoleId = roleList?.find(r => r.name === res.roleName)?.id || "";
                        setRoleId(newRoleId);
                
            }catch(err){
                setSelectedUser(null);
            }
        }
        if(!selectedUserId) return;
        fetch();
    },[selectedUserId,roleList])
  // thông báo lỗi
  useEffect(() =>{
    if(createError) showToast(createError)
    if(updateError) showToast(updateError);
  },[createError,updateError])
  // lấy data role
  useEffect(() =>{
    const fetch = async () =>{
        try{
            const res  = await dispatch(getAllRoles({page:0,size:10})).unwrap();
            setRoleList(res.elements);
            setRoleId(res.elements[1]?.id || "");
        }catch(err){
            setRoleList(null);
        }
    }
    fetch()
  },[])
  // xử lí tạo mới
  const handleSubmitCreate = async () => {
    try{
        const res = await dispatch(createUser({username,password,fullname,role:{id:roleId}})).unwrap();
        if(res){
            showToast("Tạo mới người dùng thành công");
            setSuccess(true);
        }
    }catch(err){
        console.log(err)
    }

  setUsername("");
  setPassword("");
  setFullname("")
};
// xử lí cập nhật
const handleSubmitUpdate = async () =>{
    try{
        const res = await dispatch(updateUser({id:selectedUserId,username,password,fullname,role:{id:roleId}})).unwrap();
        if(res){
            setSuccess(true);
            showToast("Cập nhật người dùng thành công");
        }
    }catch(err){
        console.log(err);
    }
    setUsername("");
  setPassword("");
  setFullname("")
}
// 🚫 Disable user
  const handleDisableUser = async (id: string) => {
    const ok = window.confirm("Bạn có chắc muốn ngừng hoạt động người dùng này?");
    if (!ok) return;

    try {
      const res = await dispatch(deleteUser({ id })).unwrap();
      if(res){
        setSuccess(true);
        showToast("Đã ngừng hoạt động người dùng");
      }
    } catch (err) {
      console.log(err);
    }
  };
  // enable user
  const handleEnableUser = async (id: string) => {
    const ok = window.confirm("Bạn có chắc muốn kích hoạt lại người dùng này?");
    if (!ok) return;

    try {
      const res = await dispatch(activeUser({ id })).unwrap();
      if(res){
        setSuccess(true);
        showToast("Đã kích hoạt lại người dùng");
      }
    } catch (err) {
      console.log(err);
    }
  }
    return {
        username,setUsername,fullname,setFullname,password,
        setPassword,roleId,setRoleId,roleList,handleSubmitCreate,
        handleSubmitUpdate,selectedUser,setSelectedUser,selectedUserId,setSelectedUserId,
        createError,updateError,success,setSuccess,handleDisableUser,handleEnableUser
    }
}