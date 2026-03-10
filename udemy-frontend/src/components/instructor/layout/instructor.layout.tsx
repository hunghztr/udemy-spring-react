import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import InstructorSidebar from "./instructor.sidebar";
import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hook";
import { countNew } from "@/redux/thunks/notification.thunk";

const SIDEBAR_WIDTH = 260;

export default function InstructorLayout() {
  const dispatch = useAppDispatch()
  useEffect(() =>{
      dispatch(countNew());
    },[dispatch])
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* SIDEBAR */}
      <Box
        sx={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          borderRight: "1px solid",
          borderColor: "divider"
        }}
      >
        <InstructorSidebar />
      </Box>

      {/* CONTENT - SCROLL CONTAINER */}
      <Box
        sx={{
          flex: 1,
          height: "100vh",
          overflow: "hidden", // chặn scroll window
        }}
      >
        <Box
          sx={{
            height: "100%",
            overflowY: "auto", // scroll nằm ở đây
            p: 4,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
