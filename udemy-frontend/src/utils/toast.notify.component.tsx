import { Box, Typography, Tooltip, useTheme } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

interface ToastNotifyProps {
  title: string;
  message: string;
  url?: string;
  type?: "success" | "error";
}

export default function ToastNotify({
  title,
  message,
  url,
  type = "success",
}: ToastNotifyProps) {
  const theme = useTheme();

  const isError = type === "error";

  const mainColor = isError
    ? theme.palette.error.main
    : theme.palette.primary.main;

  const handleClick = () => {
    if (url) window.open(`${import.meta.env.VITE_FRONTEND_URL}${url}`)
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        display: "flex",
        gap: 1.5,
        alignItems: "flex-start",

        cursor: url ? "pointer" : "default",

        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,

        px: 2,
        py: 1.5,
        minWidth: 320,

        borderRadius: 1.5,
        borderLeft: `4px solid ${mainColor}`,

        boxShadow:
          "0px 4px 12px rgba(0,0,0,0.08), 0px 2px 4px rgba(0,0,0,0.06)",

        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: theme.palette.action.hover,
        },
      }}
    >
      {/* Icon */}
      {isError ? (
        <ErrorOutlineIcon sx={{ color: mainColor, fontSize: 22, mt: "2px" }} />
      ) : (
        <CheckCircleOutlineIcon
          sx={{ color: mainColor, fontSize: 22, mt: "2px" }}
        />
      )}

      {/* Content */}
      <Box flex={1}>
        {/* Title */}
        <Tooltip title={title} arrow placement="top-start">
          <Typography
            fontSize={14}
            fontWeight={600}
            noWrap
            sx={{ maxWidth: 220 }}
          >
            {title}
          </Typography>
        </Tooltip>

        {/* Message */}
        <Tooltip title={message} arrow placement="top-start">
          <Typography
            fontSize={13}
            color="text.secondary"
            sx={{
              maxWidth: 220,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {message}
          </Typography>
        </Tooltip>
      </Box>

      {/* Link icon */}
      {url && (
        <OpenInNewIcon
          sx={{
            fontSize: 18,
            color: theme.palette.text.secondary,
            mt: "2px",
          }}
        />
      )}
    </Box>
  );
}
