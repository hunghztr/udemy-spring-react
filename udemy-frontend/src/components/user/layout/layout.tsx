import { Outlet } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import { Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { useEffect, useRef } from "react";
import { countNew, getNotifications } from "@/redux/thunks/notification.thunk";

export default function Layout() {
  const fetchedRef = useRef(false)
  const user = useAppSelector(state => state.currentUser);
  const dispatch = useAppDispatch();
  useEffect(() =>{
    if(user?.id){
      dispatch(countNew())
    }
  },[dispatch, user?.id])

  useEffect(() => {
    if (!user?.id || fetchedRef.current) return;

    fetchedRef.current = true;
    dispatch(getNotifications({ page: 0, size: 10 }));

  }, [dispatch, user?.id]);
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
