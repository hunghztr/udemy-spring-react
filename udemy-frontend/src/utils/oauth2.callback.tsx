import Loading from "@/components/loading";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { getMe, refreshToken } from "@/redux/thunks/auth.thunk";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuth2Callback() {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector(state => state.auth.accessToken);
  const navigate = useNavigate();
  useEffect(() =>{
    if(accessToken) navigate("/",{replace:true});
    const refresh = async () =>{
      await dispatch(refreshToken());
      await dispatch(getMe());
    }
    refresh();
  },[dispatch,accessToken,navigate])

  return <Loading />;
}
