import { Outlet } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import { Box } from "@mui/material";
import { useAppDispatch } from "@/redux/hook";
import { useEffect } from "react";
import { countNew } from "@/redux/thunks/notification.thunk";

export default function Layout() {
  const dispatch = useAppDispatch();
  useEffect(() =>{
    dispatch(countNew())
  },[dispatch])
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />

      {/* Nội dung chính */}
      <Box sx={{ flex: 1}}>
        <Outlet />
      </Box>

      <Footer />
    </Box>
  );
}
