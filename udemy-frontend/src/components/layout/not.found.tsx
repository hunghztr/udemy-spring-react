import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        bgcolor: "background.default",
        p: 2,
      }}
    >
      <Typography
        variant="h1"
        sx={{ fontSize: { xs: 80, sm: 120 }, fontWeight: "bold", mb: 2 }}
      >
        404
      </Typography>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Xin lỗi! Không tìm thấy trang
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, maxWidth: 400 }}>
        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate("/")}>
        Về trang chủ
      </Button>
    </Box>
  );
}
