import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { getMe, loginWithInfo } from "@/redux/thunks/auth.thunk";
import { clearAllErrors } from "@/redux/slices/error.slice";




export const useLoginHook = () =>{
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const serverError = useAppSelector(state => state.error.errors['auths/loginWithInfo']);
  const [error, setError] = useState<string>();
  const roleName = useAppSelector(state => state.currentUser.roleName);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = emailRef?.current?.value || "";
    const password = passwordRef?.current?.value || "";

   
    if (!email || !password) {
      setError("Vui lòng điền đủ thông tin");
      return;
    }

      try {
        await dispatch(loginWithInfo({ username: email, password })).unwrap();
        await dispatch(getMe());
        dispatch(clearAllErrors());
      
      } catch (err: unknown) {
        const axiosError = err as string;
        console.log(axiosError)
      }
    
  };
  useEffect(() =>{
    if(roleName === 'ADMIN') navigate("/admin");
    if(roleName === 'USER') navigate("/");
  },[roleName])
  const handleGoogleLogin = async () => {
    window.location.href = `${import.meta.env.VITE_BACKEND}/oauth2/authorization/google`;
  };


  const handleForgotPassword = () => {
    navigate("/forgot-password")
  };

 
  return {
    emailRef,
    passwordRef,
    error,
    handleLogin,
    handleGoogleLogin,
    handleForgotPassword,
    serverError
  };
}