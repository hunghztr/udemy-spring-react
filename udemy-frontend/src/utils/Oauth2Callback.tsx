import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import Loading from "../components/layout/loading";
import { loginGoogleWithInfo } from "../redux/thunks/auth.thunk";

export default function OAuth2Callback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.currentUser.user.accessToken);

  const hasHandled = useRef<boolean>(false);

  useEffect(() => {
    if (hasHandled.current) return;
    hasHandled.current = true;

    const accessToken = searchParams.get("token") || token;

    if (accessToken && accessToken !== token) {
      dispatch(loginGoogleWithInfo(accessToken));
    }

    if (accessToken) {
      navigate("/", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Loading />;
}
