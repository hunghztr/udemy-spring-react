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
        position: "fixed",
        inset: 0,
        zIndex: 2000,

        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",

        backgroundColor: "rgba(255,255,255,0.4)", // nhìn thấy phía sau
        backdropFilter: "blur(4px)",              // blur UI phía sau
      }}
    >
      <CircularProgress size={size} sx={{ mb: 2 }} />
      <Typography variant="h6">{message}</Typography>
    </Box>
  );
};

export default Loading;
