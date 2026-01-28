import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { register } from "@/redux/thunks/auth.thunk";
import { showToast } from "@/utils/toast";
import { useRef, useState } from "react";


export const useRegisterHook = (onSwitchMode: () => void) =>{
const dispatch = useAppDispatch();
  const usernameRef = useRef<HTMLInputElement>(null);
  const fullNameRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState("");
  const serverError = useAppSelector((state) => state.error.errors['auths/register']);
   const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const username = usernameRef.current?.value.trim();
    const fullname = fullNameRef.current?.value.trim();
    const password = passRef.current?.value.trim();
    const confirm = confirmRef.current?.value.trim();

    if (!username || !fullname || !password || !confirm) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (password !== confirm) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    setError("");
    try {
      await dispatch(register({ username, password, fullname })).unwrap();
      onSwitchMode();
      showToast("Đăng kí thành công");
    } catch (err) {
      const errAxios = err as string;
      console.log(errAxios);
    }
  };
  return {
    usernameRef,fullNameRef,passRef,confirmRef,error,serverError,handleRegisterSubmit
  }
}