// src/components/Loading.tsx
import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

interface LoadingProps {
  message?: string;
  size?: number;
}

const Loading: React.FC<LoadingProps> = ({
  message = "Đang xử lý...",
  size = 60,
}) => {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress size={size} sx={{ mb: 2 }} />
      <Typography variant="h6">{message}</Typography>
    </Box>
  );
};

export default Loading;
