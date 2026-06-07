import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { useTheme } from "@mui/material/styles";
import { useEffect } from "react";
import { showToast } from "@/utils/toast";
import { logOut } from "@/redux/thunks/auth.thunk";
import NotifyIcon from "@/components/notification/notify.icon";

const SIDEBAR_WIDTH = 240;

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const roleName = useAppSelector((state) => state.currentUser.roleName);

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

  return (
    <Box
      sx={{
        width: SIDEBAR_WIDTH,
        height: "100vh",
        bgcolor: theme.palette.sidebar.main,
        color: theme.palette.sidebar.text,
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1200,
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          TRANG QUẢN TRỊ
        </Typography>
      </Box>

      {/* Menu */}
      <List sx={{ flex: 1 }}>
        {/* Users */}
        <ListItemButton
          selected={location.pathname.startsWith("/admin/users")}
          onClick={() => navigate("/admin/users")}
          sx={menuItemStyle}
        >
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Quản lý Người dùng" />
        </ListItemButton>

        {/* Courses */}
        <ListItemButton
          selected={location.pathname.startsWith("/admin/courses")}
          onClick={() => navigate("/admin/courses")}
          sx={menuItemStyle}
        >
          <ListItemIcon>
            <SchoolIcon />
          </ListItemIcon>
          <ListItemText primary="Quản lý Khóa học" />
        </ListItemButton>

        {/* Categories */}
        <ListItemButton
          selected={location.pathname.startsWith("/admin/categories")}
          onClick={() => navigate("/admin/categories")}
          sx={menuItemStyle}
        >
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Quản lý Danh mục" />
        </ListItemButton>

        {/* Wallet */}
        <ListItemButton
          selected={location.pathname.startsWith("/admin/wallets")}
          onClick={() => navigate("/admin/wallets")}
          sx={menuItemStyle}
        >
          <ListItemIcon>
            <AccountBalanceWalletIcon />
          </ListItemIcon>
          <ListItemText primary="Quản lý doanh thu" />
        </ListItemButton>

        {/* Notifications */}
        <ListItemButton
          selected={location.pathname.startsWith("/admin/notifications")}
          onClick={() => navigate("/admin/notifications")}
          sx={menuItemStyle}
        >
          <ListItemIcon>
            <NotifyIcon />
          </ListItemIcon>
          <ListItemText primary="Thông báo" />
        </ListItemButton>
      </List>

      {/* Logout */}
      <List>
        <ListItemButton onClick={handleLogout} sx={menuItemStyle}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Đăng xuất" />
        </ListItemButton>
      </List>
    </Box>
  );
}