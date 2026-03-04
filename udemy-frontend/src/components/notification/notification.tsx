import {Box,Paper,Typography,List,ListItemButton,
  ListItemText,Stack,Divider,
  Chip,} from "@mui/material";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { deleteNotification, getNotifications, markNotification } from "@/redux/thunks/notification.thunk";
import {  useMemo, useState } from "react";
import { formatDateTime, fromNow } from "@/helpers/day.time";
import LoadMoreTrigger from "@/components/notification/load.more.trigger";
import { motion, AnimatePresence } from "framer-motion";
import { itemVariants,listVariants } from "@/helpers/variants";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { getDefault } from "@/redux/slices/notification.slice";

export default function Notification() {
    const [collapsed, setCollapsed] = useState(true);
    
    const [page, setPage] = useState(0);
    const dispatch = useAppDispatch();

    const { items, hasNext } = useAppSelector(
        (state) => state.notifications
    );

    

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
    const collapse = () => {
      dispatch(getDefault());
      setPage(0);
      setCollapsed(true);
    };

    const loadMore = () => {
      if (!hasNext) return;

      const nextPage = page + 1;
      dispatch(getNotifications({ page: nextPage, size: 10 }));
      setPage(nextPage);
      setCollapsed(false);
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
            <motion.div
              variants={listVariants}
              initial="hidden"
              animate="visible"
            >
            <AnimatePresence>
                {sortList.map((noti) => (
                  <motion.div
                    key={noti.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                  >
                    <Box>
                      <ListItemButton
                        onClick={() => handleClick(noti)}
                        sx={{
                          alignItems: "flex-start",
                          bgcolor: noti.read ? "transparent" : "action.hover",
                          transition: "background-color 0.25s ease",
                        }}
                      >
                        <ListItemText
                          primary={
                            <Stack
                              direction="row"
                              alignItems="center"
                              justifyContent="space-between"
                              width="100%"
                            >
                              {/* LEFT: title + badge */}
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Typography fontWeight={noti.read ? 400 : 600}>
                                  {noti.title}
                                </Typography>

                                {!noti.read && (
                                  <Chip label="Mới" size="small" color="primary" />
                                )}
                              </Stack>

                              {/* RIGHT: time + delete */}
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Typography
                                  variant="caption"
                                  color="text.disabled"
                                  sx={{ whiteSpace: "nowrap" }}
                                  title={formatDateTime(noti.createdAt)}
                                >
                                  {fromNow(noti.createdAt)}
                                </Typography>

                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(deleteNotification(noti.id || ""));
                                  }}
                                >
                                  <CloseIcon fontSize="small" />
                                </IconButton>
                              </Stack>
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
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </List>
          {collapsed && hasNext && (
            <LoadMoreTrigger onClick={loadMore} label="Xem thêm" />
          )}
          {!collapsed && items.length > 10 && (
            <LoadMoreTrigger onClick={collapse} label="Thu gọn" />
          )}
          </Box>
        )}
      </Paper>
    </Box>
  );
}
