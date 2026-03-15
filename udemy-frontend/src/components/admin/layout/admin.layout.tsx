import { Outlet, Navigate } from "react-router-dom";
import AdminSidebar from "./admin.sidebar";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { useEffect, useRef } from "react";
import { countNew, getNotifications } from "@/redux/thunks/notification.thunk";

const SIDEBAR_WIDTH = 240;

export default function AdminLayout() {

  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.currentUser);

  const fetchedRef = useRef(false);

  useEffect(() => {
    dispatch(countNew());
  }, [dispatch]);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    dispatch(getNotifications({ page: 0, size: 10 }));
  }, [dispatch]);

  // ✅ Check role
  if (!user || (user.roleName !== "ADMIN")) {
    return <Navigate to="/403" replace />;
  }

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />
      <main
        style={{
          marginLeft: SIDEBAR_WIDTH,
          padding: 24,
          width: "100%",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}