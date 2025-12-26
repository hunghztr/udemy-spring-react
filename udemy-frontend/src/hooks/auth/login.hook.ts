import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { useRef, useState } from "react";
import { loginWithInfo } from "../../redux/thunks/auth.thunk";


export const useLoginHook = () =>{
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const serverError = useAppSelector(state => state.ui.error);
  const [error, setError] = useState<string>();


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

        emailRef.current!.value = "";
        passwordRef.current!.value = "";

        navigate("/");
      } catch (err: unknown) {
        const axiosError = err as string;
        console.log(axiosError)
      }
    
  };

  const handleGoogleLogin = async () => {
    window.location.href = `${import.meta.env.VITE_BACKEND}/oauth2/authorization/google`;
  };


  const handleForgotPassword = () => {
    alert("Navigate to Forgot Password page");
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