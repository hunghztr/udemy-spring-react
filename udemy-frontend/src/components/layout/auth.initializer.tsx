import { useEffect } from "react";
import { useAppDispatch } from "../../redux/hook";
import {logOut, refreshToken } from "../../redux/thunks/auth.thunk";
import { setInitialized } from "../../redux/slices/auth.slice";

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
    })
    .finally(() => {
      dispatch(setInitialized(true));
    });
}, []);



  return <>{children}</>;
}
