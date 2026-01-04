import { Box, Typography, useTheme } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function ToastComponent({ message }: { message: string }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        background: `linear-gradient(135deg,
          ${theme.palette.primary.main},
          ${theme.palette.primary.dark})`,
        color: "#fff",
        px: 2.5,
        py: 1.5,
        borderRadius: 999,
        minWidth: 260,
        boxShadow: "0 12px 30px rgba(0,0,0,.3)",
      }}
    >
      <CheckCircleIcon />
      <Typography fontWeight={500}>{message}</Typography>
    </Box>
  );
}
