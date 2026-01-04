import { useEffect } from "react";
import { useAppDispatch } from "../redux/hook";
import {logOut, refreshToken } from "../redux/thunks/auth.thunk";

export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
 useEffect(() => {
  dispatch(refreshToken())
    .unwrap()
    .catch(() => {
      dispatch(logOut());
    });
}, []);



  return <>{children}</>;
}
