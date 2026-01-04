import { useAppDispatch, useAppSelector } from "../redux/hook";
import Loading from "../components/layout/loading";
import { useEffect } from "react";
import { refreshToken } from "../redux/thunks/auth.thunk";
import { useNavigate } from "react-router-dom";

export default function OAuth2Callback() {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector(state => state.auth.accessToken);
  const navigate = useNavigate();
  useEffect(() =>{
    if(accessToken) navigate("/",{replace:true});
    dispatch(refreshToken());
  },[dispatch,accessToken,navigate])

  return <Loading />;
}
