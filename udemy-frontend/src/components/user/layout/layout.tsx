import { Outlet } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import { Box } from "@mui/material";

export default function Layout() {

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
