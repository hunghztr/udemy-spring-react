import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../../../redux/hook";
import Loading from "../../loading";

export default function ProtectedLayout() {
  const { isAuthenticated, isInittialized } = useAppSelector(
    state => state.auth
  );
  const location = useLocation();

  // Chưa xác định auth → chờ
  if (!isInittialized) {
    return <Loading />
  }

  // Chưa login → đá về /auth
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/auth"
        replace
        state={{ from: location }}
      />
    );
  }

  // OK → render route con
  return <Outlet />;
}
