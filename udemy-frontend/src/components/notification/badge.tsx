import { Badge } from "@mui/material";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";

interface NotificationBadgeProps {
  count?: number;
  variant?: "dot" | "count";
}

export default function NotificationBadge({
  count = 0,
  variant = "count",
}: NotificationBadgeProps) {
  if (variant === "dot") {
    return (
      <Badge
        variant="dot"
        color="error"
        invisible={count === 0}
      >
        <NotificationsNoneOutlinedIcon />
      </Badge>
    );
  }

  return (
    <Badge
      badgeContent={count > 9 ? "9+" : count}
      color="error"
      invisible={count === 0}
      sx={{
        "& .MuiBadge-badge": {
          fontSize: "10px",
          height: 16,
          minWidth: 16,
          padding: "0 4px",
        },
      }}
    >
      <NotificationsNoneOutlinedIcon />
    </Badge>
  );
}
