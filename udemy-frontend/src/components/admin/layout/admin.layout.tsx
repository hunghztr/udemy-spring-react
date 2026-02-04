import { Outlet } from "react-router-dom";
import AdminSidebar from "./admin.sidebar";
import { useAppDispatch } from "@/redux/hook";
import { useEffect } from "react";
import { countNew } from "@/redux/thunks/notification.thunk";

const SIDEBAR_WIDTH = 240;

export default function AdminLayout() {
  const dispatch = useAppDispatch();
  useEffect(() =>{
    dispatch(countNew())
  },[dispatch])
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
