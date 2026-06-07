import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";

import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { showToast } from "@/utils/toast";
import { logOut } from "@/redux/thunks/auth.thunk";
import NotifyIcon from "@/components/notification/notify.icon";

import { motion, AnimatePresence } from "framer-motion";

const SIDEBAR_WIDTH = 240;
const COLLAPSED_WIDTH = 72;

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const roleName = useAppSelector((state) => state.currentUser.roleName);

  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (roleName === "") {
      navigate("/auth");
      showToast("Đăng xuất thành công");
    }
  }, [roleName]);

  const handleLogout = async () => {
    try {
      await dispatch(logOut()).unwrap();
    } catch (err) {
      console.log(err);
    }
  };

  const menuItemStyle = {
    color: theme.palette.sidebar.text,
    "& .MuiListItemIcon-root": {
      color: theme.palette.sidebar.text,
    },
    "&:hover": {
      bgcolor: theme.palette.sidebar.hover,
    },
    "&.Mui-selected": {
      bgcolor: theme.palette.sidebar.active,
    },
  };

  const renderItem = (
    label: string,
    icon: React.ReactNode,
    path: string
  ) => {
    const selected = location.pathname.startsWith(path);

    return (
      <Tooltip title={collapsed ? label : ""} placement="right">
        <ListItemButton
          selected={selected}
          onClick={() => navigate(path)}
          sx={{
            ...menuItemStyle,
            justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          <ListItemIcon
            sx={{
              color: theme.palette.sidebar.text,
              minWidth: collapsed ? "auto" : 40,
              justifyContent: "center",
            }}
          >
            {icon}
          </ListItemIcon>

          {/* ✨ ANIMATED TEXT */}
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                key="text"
                initial={{ opacity: 0, x: -10, filter: "blur(2px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -10, filter: "blur(2px)" }}
                transition={{ duration: 0.18, ease: "easeInOut" }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  whiteSpace: "nowrap",
                }}
              >
                <ListItemText primary={label} />
              </motion.div>
            )}
          </AnimatePresence>
        </ListItemButton>
      </Tooltip>
    );
  };

  return (
    <motion.div
      animate={{ width: collapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      style={{
        height: "100vh",
        background: theme.palette.sidebar.main,
        color: theme.palette.sidebar.text,
        position: "fixed",
        top: 0,
        left: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
        }}
      >
        {!collapsed && (
          <Typography fontWeight="bold">TRANG QUẢN TRỊ</Typography>
        )}

        <IconButton
          size="small"
          onClick={() => setCollapsed((prev) => !prev)}
          sx={{ color: theme.palette.sidebar.text }}
        >
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>

      {/* MENU */}
      <List sx={{ flex: 1 }}>
        {renderItem("Thống kê", <DashboardIcon />, "/admin/dashboard")}
        {renderItem("Quản lý Người dùng", <PeopleIcon />, "/admin/users")}
        {renderItem("Quản lý Khóa học", <SchoolIcon />, "/admin/courses")}
        {renderItem("Quản lý Danh mục", <CategoryIcon />, "/admin/categories")}
        {renderItem("Thông báo", <NotifyIcon />, "/admin/notifications")}
      </List>

      {/* LOGOUT */}
      <List>
        <Tooltip title={collapsed ? "Đăng xuất" : ""} placement="right">
          <ListItemButton
            onClick={handleLogout}
            sx={{
              ...menuItemStyle,
              justifyContent: collapsed ? "center" : "flex-start",
            }}
          >
            <ListItemIcon
              sx={{
                color: theme.palette.sidebar.text,
                minWidth: collapsed ? "auto" : 40,
                justifyContent: "center",
              }}
            >
              <LogoutIcon />
            </ListItemIcon>

            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10, filter: "blur(2px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: -10, filter: "blur(2px)" }}
                  transition={{ duration: 0.18 }}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <ListItemText primary="Đăng xuất" />
                </motion.div>
              )}
            </AnimatePresence>
          </ListItemButton>
        </Tooltip>
      </List>
    </motion.div>
  );
}