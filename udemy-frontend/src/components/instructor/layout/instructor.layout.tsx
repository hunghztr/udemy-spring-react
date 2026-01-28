import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import InstructorSidebar from "./instructor.sidebar";

const SIDEBAR_WIDTH = 260;

export default function InstructorLayout() {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* SIDEBAR */}
      <Box
        sx={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          borderRight: "1px solid #eee",
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
