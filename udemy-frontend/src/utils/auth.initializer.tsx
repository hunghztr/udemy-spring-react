import { useAppDispatch } from "@/redux/hook";
import { getMe, logOut, refreshToken } from "@/redux/thunks/auth.thunk";
import { useEffect } from "react";

export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
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
