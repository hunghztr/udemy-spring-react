import { Box, Typography, useTheme } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface Props {
  message: string;
  type?: "success" | "error";
}

export default function ToastComponent({
  message,
  type = "success",
}: Props) {
  const theme = useTheme();
  const isError = type === "error";

  const mainColor = isError
    ? theme.palette.error.main
    : theme.palette.primary.main;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.25,

        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,

        px: 2,
        py: 1.25,
        minWidth: 280,

        borderRadius: 1.5,

        // 👇 Udemy-style status indicator
        borderLeft: `4px solid ${mainColor}`,

        boxShadow:
          "0px 4px 12px rgba(0,0,0,0.08), 0px 2px 4px rgba(0,0,0,0.06)",
      }}
    >
      {isError ? (
        <ErrorOutlineIcon sx={{ color: mainColor, fontSize: 22 }} />
      ) : (
        <CheckCircleOutlineIcon sx={{ color: mainColor, fontSize: 22 }} />
      )}

      <Typography fontSize={14} fontWeight={500}>
        {message}
      </Typography>
    </Box>
  );
}
