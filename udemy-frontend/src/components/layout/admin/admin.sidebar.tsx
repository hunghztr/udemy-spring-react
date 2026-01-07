import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { logOut } from "../../../redux/thunks/auth.thunk";
import { useTheme } from "@mui/material/styles";
import { useEffect } from "react";
import { showToast } from "../../../utils/toast";

const SIDEBAR_WIDTH = 240;

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const roleName = useAppSelector(state => state.currentUser.roleName);
  useEffect(() =>{
    if(roleName === '') {
        navigate("/auth")
        showToast("Đăng xuất thành công");
    }
  },[roleName])
  const handleLogout = async () => {
    try{
    await dispatch(logOut()).unwrap();
    }catch(err){
        console.log(err)
    }
  };

  const menuItemStyle = {
    color: theme.palette.primary.contrastText,
    "& .MuiListItemIcon-root": {
      color: theme.palette.primary.contrastText,
    },
    "&:hover": {
      bgcolor: theme.palette.primary.main,
    },
    "&.Mui-selected": {
      bgcolor: theme.palette.primary.light,
    },
  };

  return (
    <Box
      sx={{
        width: SIDEBAR_WIDTH,
        height: "100vh",
        bgcolor: theme.palette.primary.dark,
        color: theme.palette.primary.contrastText,
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

      <Divider sx={{ bgcolor: theme.palette.primary.light }} />

      {/* Menu */}
      <List sx={{ flex: 1 }}>
        <ListItemButton
          selected={location.pathname.startsWith("/admin/users")}
          onClick={() => navigate("/admin/users")}
          sx={menuItemStyle}
        >
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Quản lý User" />
        </ListItemButton>

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
      </List>

      <Divider sx={{ bgcolor: theme.palette.primary.light }} />

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
