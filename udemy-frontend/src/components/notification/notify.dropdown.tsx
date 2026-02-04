import {
  Box,
  Menu,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { markNotification } from "@/redux/thunks/notification.thunk";
import { useNavigate } from "react-router-dom";
import { fromNow } from "@/helpers/day.time";
import NotifyIcon from "./notify.icon";

export default function NotifyDropdown() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { items } = useAppSelector((s) => s.notifications);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const topItems = items.slice(0, 5);

  return (
    <>
      {/* ICON */}
      <Box
        onMouseEnter={(e) => setAnchorEl(e.currentTarget)}
        sx={{ cursor: "pointer" }}
      >
        <NotifyIcon />
      </Box>

      {/* DROPDOWN */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{
          onMouseLeave: () => setAnchorEl(null),
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            width: 360,
            maxHeight: 420,
            borderRadius: 3,
            overflow: "hidden",
          },
        }}
      >
        {/* HEADER */}
        <Box px={2} py={1.5}>
          <Typography fontWeight={600}>Thông báo</Typography>
        </Box>
        <Divider />

        {/* LIST */}
        {topItems.length === 0 ? (
          <Box p={2}>
            <Typography variant="body2" color="text.secondary">
              Không có thông báo
            </Typography>
          </Box>
        ) : (
          <Box sx={{ maxHeight: 320, overflowY: "auto" }}>
            <List disablePadding>
              {topItems.map((n) => (
                <ListItemButton
                  key={n.id}
                  onClick={() => {
                    if (!n.read) dispatch(markNotification(n?.id||""));
                    if (n.url) navigate(n.url);
                    setAnchorEl(null);
                  }}
                  sx={{
                    alignItems: "flex-start",
                    bgcolor: n.read ? "transparent" : "action.hover",
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography fontWeight={n.read ? 400 : 600}>
                        {n.title}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          {n.message}
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                          {fromNow(n.createdAt)}
                        </Typography>
                      </>
                    }
                  />
                </ListItemButton>
              ))}
            </List>
          </Box>
        )}

        <Divider />

        {/* FOOTER */}
        <Box
          px={2}
          py={1.5}
          textAlign="center"
          sx={{ cursor: "pointer" }}
          onClick={() => {
            navigate("/instructor/notification");
            setAnchorEl(null);
          }}
        >
          <Typography fontWeight={600} color="primary">
            Xem tất cả
          </Typography>
        </Box>
      </Menu>
    </>
  );
}
