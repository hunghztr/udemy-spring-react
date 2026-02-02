import {
  Box,
  Paper,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Chip,
  Divider,
} from "@mui/material";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { getNotifications, markNotification } from "@/redux/thunks/notification.thunk";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatDateTime, fromNow } from "@/helpers/day.time";
import LoadMoreTrigger from "@/components/notification/load.more.trigger";

export default function AdminNotificationPage() {
    const fetchedRef = useRef(false)
    const [page, setPage] = useState(0);
    const dispatch = useAppDispatch();

    const { items, hasNext } = useAppSelector(
        (state) => state.notifications
    );

    useEffect(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;
        dispatch(getNotifications({ page: 0, size: 10 }));
    }, [dispatch]);

    const sortList = useMemo(() => {
        return [...items].sort(
        (a, b) => Number(a.read) - Number(b.read)
        );
    }, [items]);
    const handleClick = (noti: any) => {
        if (!noti.isRead && noti.id) {
          dispatch(markNotification(noti.id))
        }
        if (noti.url) window.open(`${import.meta.env.VITE_FRONTEND_URL}${noti.url}`);
    };
    const loadMore = () => {
        if (!hasNext) return;

        const nextPage = page + 1;
        dispatch(getNotifications({ page: nextPage, size: 10 }));
        setPage(nextPage);
    };

  return (
    <Box sx={{ ml: "90px", p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
          <NotificationsNoneOutlinedIcon />
          <Typography variant="h6" fontWeight="bold">
            Thông báo
          </Typography>
        </Stack>

        {sortList.length === 0 ? (
          <Typography color="text.secondary">
            Không có thông báo nào
          </Typography>
        ) : (
            <Box>
          <List disablePadding>
            {sortList.map((noti, index) => (
              <Box key={noti.id ?? index}>
                <ListItemButton
                  onClick={() => handleClick(noti)}
                  sx={{
                    alignItems: "flex-start",
                    bgcolor: noti.read ? "transparent" : "action.hover",
                  }}
                >
                  <ListItemText
                    primary={
                        <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        justifyContent="space-between"
                        width="100%"
                        >
                        {/* LEFT: title + chip */}
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography fontWeight={noti.read ? 400 : 600}>
                            {noti.title}
                            </Typography>
                            {!noti.read && (
                            <Chip label="Mới" size="small" color="primary" />
                            )}
                        </Stack>

                        {/* RIGHT: time */}
                        <Typography
                            variant="caption"
                            color="text.disabled"
                            sx={{ whiteSpace: "nowrap" }}
                            title={formatDateTime(noti.createdAt)}
                        >
                            {fromNow(noti.createdAt)}
                        </Typography>
                        </Stack>
                    }
                    secondary={
                        <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                        >
                        {noti.message}
                        </Typography>
                    }
                    />

                </ListItemButton>
                <Divider />
              </Box>
            ))}
          </List>
          {hasNext && (
              <LoadMoreTrigger
                onClick={loadMore}
              />
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
}
