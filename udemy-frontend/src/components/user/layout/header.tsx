import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  TextField,
  Menu,
  MenuItem,
  Divider,
  Avatar,
  Badge,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ExploreIcon from "@mui/icons-material/Explore";

import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { persistor } from "../../../redux/store";
import { logOut } from "../../../redux/thunks/auth.thunk";
import { showToast } from "../../../utils/toast";
import { useState } from "react";

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
    "&:hover": { color: "primary.light" },
    "&:active": { color: "primary.dark" },
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
          <Link to="/">
            <Box
              component="img"
              src="/src/assets/logo-udemy.svg"
              alt="Logo"
              sx={{ height: { xs: 28, md: 40 } }}
            />
          </Link>

          <Button
            color="inherit"
            sx={{
              whiteSpace: "nowrap",
              display: { xs: "none", md: "inline-flex" },
              fontSize: { xs: "12px", md: "14px" },
              ...headerTextHover,
            }}
          >
            Khám phá
          </Button>

          <IconButton color="inherit" sx={{ display: { xs: "inline-flex", md: "none" } }}>
            <ExploreIcon sx={{ fontSize: 22 }} />
          </IconButton>
        </Box>

        {/* CENTER - SEARCH */}
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
            component={Link}
            to="/instructor/course"
            color="inherit"
            sx={{
              display: { xs: "none", md: "inline-flex" },
              fontSize: { xs: "12px", md: "14px" },
              whiteSpace: "nowrap",
              ...headerTextHover,
            }}
          >
            Giảng viên
          </Button>

          {/* ===== AUTH AREA ===== */}
          {user.id ? (
            <>
              {/* NOTIFICATION */}
              <IconButton color="inherit" sx={headerTextHover}>
                <Badge badgeContent={0} color="error">
                  <NotificationsNoneIcon />
                </Badge>
              </IconButton>

              {/* AVATAR */}
              <IconButton
                sx={{ p: 0 }}
                onMouseEnter={handleOpenMenu}
                onClick={() => navigate("/instructor/profile")}
              >
                <Avatar
                  src={user.avatarPath}
                  alt={user.username || "avatar"}
                  sx={{
                    width: 36,
                    height: 36,
                    border: "2px solid",
                    borderColor: "primary.main",
                    transition: "0.2s",
                    "&:hover": { borderColor: "primary.light" },
                  }}
                />
              </IconButton>

              {/* MENU - UDEMY STYLE */}
              <Menu
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleCloseMenu}
                MenuListProps={{ onMouseLeave: handleCloseMenu }}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    width: 280,
                    borderRadius: 3,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                    overflow: "hidden",
                  },
                }}
              >
                {/* USER HEADER */}
                <MenuItem
                  onClick={() => {
                    navigate("/instructor/profile");
                    handleCloseMenu();
                  }}
                  sx={{
                    alignItems: "flex-start",
                    gap: 1.5,
                    py: 2,
                  }}
                >
                  <Avatar src={user.avatarPath} sx={{ width: 48, height: 48 }} />
                  <Box>
                    <Box sx={{ fontWeight: 600 }}>{user.fullname}</Box>
                    <Box sx={{ fontSize: 12, color: "text.secondary" }}>
                      {user.username}
                    </Box>
                  </Box>
                </MenuItem>

                <Divider />

                <MenuItem
                  onClick={() => {
                    navigate("/my-learning");
                    handleCloseMenu();
                  }}
                >
                  Khóa học của tôi
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    navigate("/cart");
                    handleCloseMenu();
                  }}
                >
                  Giỏ hàng
                </MenuItem>
                <Divider />

                <MenuItem onClick={handleLogOut} sx={{ color: "error.main", fontWeight: 500 }}>
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
