import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import InstructorSidebar from "./instructor.sidebar";

export default function InstructorLayout() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f7f9fa" }}>
      
      {/* SIDEBAR — tự animate width */}
      <InstructorSidebar />

      {/* CONTENT — luôn sát sidebar */}
      <Box
        sx={{
          flex: 1,
          p: 4,
          overflowY: "auto",
          transition: "all 0.25s ease",
        }}
      >
        <Outlet />
      </Box>

    </Box>
  );
}
