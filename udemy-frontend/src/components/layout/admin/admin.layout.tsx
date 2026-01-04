import { Outlet } from "react-router-dom";
import AdminSidebar from "./admin.sidebar";

export default function AdminLayout() {
  return (
    <div>
        <AdminSidebar />
        <Outlet />
    </div>
  )
}
