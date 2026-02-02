import { Outlet } from "react-router-dom";
import AdminSidebar from "./admin.sidebar";

const SIDEBAR_WIDTH = 240;

export default function AdminLayout() {

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
