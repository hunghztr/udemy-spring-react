import { Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function ForbiddenPage() {

  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center",
        bgcolor: "#f9fafb"
      }}
    >
      {/* 403 animation */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: 120,
            fontWeight: 800,
            color: "#ef4444"
          }}
        >
          403
        </Typography>
      </motion.div>

      {/* text */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
          Bạn không có quyền truy cập
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Tài khoản của bạn không được phép truy cập trang này.
        </Typography>
      </motion.div>

      {/* button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/")}
        >
          Quay về trang chủ
        </Button>
      </motion.div>
    </Box>
  );
}