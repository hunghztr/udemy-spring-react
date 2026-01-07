import { useEffect, useState } from "react";
import type { IMetaResponse } from "../../type/pagination";
import type { IUserResponse } from "../../type/user.module";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { getAllUsers } from "../../redux/thunks/admin/user.thunk";

export const useUserHook = () =>{
  const [page, setPage] = useState(1);
  const [size, ] = useState(10);

  const [meta, setMeta] = useState<IMetaResponse>({currentPage:1,pageSize:10,elementTotals:0,pageTotals:0});
  const [users, setUsers] = useState<IUserResponse[] | null>(null);

  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.loading);
  const error = useAppSelector(
    (state) => state.error.errors["users/getAll"]
  );
  const [refreshFlag, setRefreshFlag] = useState<boolean>(false);
  // active / inactive filter state
  const [active, setActive] = useState<boolean>(
    true
  );
  // fetch data user
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await dispatch(getAllUsers({page:page-1,size,active})).unwrap();
        setUsers(res.elements);
        setMeta(res.meta);
      } catch {
        setUsers(null);
      }
    };
    fetchUsers();
    if(refreshFlag) setRefreshFlag(false);
  }, [page,size, dispatch,refreshFlag,active]);
  const [openCreate,setOpenCreate] = useState<boolean>(false);
  const [openUpdate,setOpenUpdate] = useState<boolean>(false);
  
  const handleToggle = (
    _: React.MouseEvent<HTMLElement>,
    newValue: boolean | null
  ) => {
    if (newValue !== null) setActive(newValue);
  };
  return {
    page,setPage,meta,users,loading,error,openCreate,setOpenCreate,openUpdate,
    setOpenUpdate,refreshFlag,setRefreshFlag,active,handleToggle
  }
  
}