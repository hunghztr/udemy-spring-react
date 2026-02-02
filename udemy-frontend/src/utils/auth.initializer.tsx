import { useConnectSse } from "@/hooks/sse.hook";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { getMe, logOut, refreshToken } from "@/redux/thunks/auth.thunk";
import { useEffect } from "react";
import { showToastNotify } from "./toast";

export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.currentUser)
  const {notification} = useConnectSse(!!user?.id);
  useEffect(() => {
    if(notification) showToastNotify(notification.title,notification.message,notification.url)
  },[notification])
  useEffect(() => {
      const initAuth = async () => {
        try {
          await dispatch(refreshToken()).unwrap();
          await dispatch(getMe()).unwrap();
        } catch (e) {
          dispatch(logOut());
        }
      };

      initAuth();
    }, [dispatch]);

  return <>{children}</>;
}
