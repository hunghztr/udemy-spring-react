import {AppBar,Toolbar,Box,Button,IconButton,
  TextField,Menu,MenuItem,Divider,} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ExploreIcon from "@mui/icons-material/Explore";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SchoolIcon from "@mui/icons-material/School";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { persistor } from "../../../redux/store";
import { logOut } from "../../../redux/thunks/auth.thunk";
import { showToast } from "../../../utils/toast";
import { useState } from "react";
import { Avatar } from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import Badge from "@mui/material/Badge";

export default function Header() {
  const user = useAppSelector((state) => state.currentUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // ===== MENU STATE =====
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  // ===== LOGOUT =====
  const handleLogOut = async () => {
    await persistor.purge();
    dispatch(logOut());
    navigate("/auth");
    showToast("Đăng xuất thành công");
    handleCloseMenu();
  };
  const headerTextHover = {
  transition: "color 0.2s ease",
  "&:hover": {
    color: "primary.light",
  },
  "&:active": {
    color: "primary.dark",
  },
};


  return (
    <AppBar position="static" color="inherit" elevation={1} sx={{ width: "100%" }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 1,
          py: { xs: 0.5, md: 1 },
        }}
      >
        {/* LEFT */}
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, md: 2 } }}>
          {/* Logo */}
          <Link to="/">
            <Box
              component="img"
              src="/src/assets/logo-udemy.svg"
              alt="Logo"
              sx={{ height: { xs: 28, md: 40 } }}
            />
          </Link>
          {/* Explore */}
          <Button
            color="inherit"
            sx={{
              whiteSpace: "nowrap",
              display: { xs: "none", md: "inline-flex" },
              fontSize: { xs: "12px", md: "14px" },
              ...headerTextHover
            }}
          >
            Khám phá
          </Button>
          {/* Mobile explore */}
          <IconButton color="inherit" sx={{ display: { xs: "inline-flex", md: "none" } }}>
            <ExploreIcon sx={{ fontSize: 22 }} />
          </IconButton>
        </Box>
        {/* CENTER - Search */}
        <Box
          sx={{
            flex: 1,
            mx: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Search for anything"
            sx={{
              display: { xs: "none", md: "flex" },
              "& input": { fontSize: { xs: "12px", md: "14px" } },
              "& .MuiInputBase-root": {
                borderRadius: 10,
                backgroundColor: "#f0f2f5",
                py: { md: 0.5 },
              },
            }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: "gray" }} />,
            }}
          />
          <IconButton color="inherit" sx={{ display: { xs: "inline-flex", md: "none" } }}>
            <SearchIcon sx={{ fontSize: 22 }} />
          </IconButton>
        </Box>
        {/* RIGHT */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, md: 2 },
            flexShrink: 0,
            px: { xs: 0.5, md: 0 },
          }}
        >
          <Button
            color="inherit"
            sx={{
              display: { xs: "none", md: "inline-flex" },
              fontSize: { xs: "12px", md: "14px" },
              whiteSpace: "nowrap",
              ...headerTextHover
            }}
          >
            Giảng viên
          </Button>
          {/* ===== AUTH AREA ===== */}
          {user.id ? (
            <>
              {/* 🔔 Notifications */}
              <IconButton color="inherit" sx={headerTextHover}>
                <Badge badgeContent={0} color="error">
                  <NotificationsNoneIcon />
                </Badge>

              </IconButton>

              {/* 👤 Avatar + menu */}
              <IconButton onClick={handleOpenMenu} sx={{ p: 0 }}>
                <Avatar
                  src={user.avatarPath}
                  alt={user.username || "avatar"}
                  sx={{
                    width: 36,
                    height: 36,
                    border: "2px solid",
                    borderColor: "primary.main",
                    cursor: "pointer",
                    transition: "0.2s",

                    "&:hover": {
                      borderColor: "primary.light",
                    },

                    "&:active": {
                      borderColor: "primary.dark",
                    },
                  }}
                />

              </IconButton>


              {/* Dropdown menu */}
              <Menu
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleCloseMenu}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem
                  onClick={() => {
                    navigate("/cart");
                    handleCloseMenu();
                  }}
                >
                  <ShoppingCartIcon fontSize="small" sx={{ mr: 1 }} />
                  Giỏ hàng
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate("/my-learning");
                    handleCloseMenu();
                  }}
                >
                  <SchoolIcon fontSize="small" sx={{ mr: 1 }} />
                  Khóa học của tôi
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogOut} sx={{ color: "error.main" }}>
                  Đăng xuất
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Link to="/auth">
              <Button
                variant="outlined"
                color="primary"
                size="small"
                sx={{
                  minWidth: { xs: 60, md: 80 },
                  px: { xs: 1, md: 2 },
                  fontSize: { xs: "11px", md: "14px" },
                  whiteSpace: "nowrap",
                }}
              >
                Login
              </Button>
            </Link>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
