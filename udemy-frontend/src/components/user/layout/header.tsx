import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Avatar,
  Popover,
} from "@mui/material";

import ExploreIcon from "@mui/icons-material/Explore";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { persistor } from "@/redux/store";
import { logOut } from "@/redux/thunks/auth.thunk";
import { showToast } from "@/utils/toast";
import NotifyDropdown from "@/components/notification/notify.dropdown";
import SearchInput from "../course/search.input";
import HomeCategoryHeader from "../home/home.category.header";

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


  // explore
  const [exploreAnchor, setExploreAnchor] = useState<null | HTMLElement>(null);

  const openExplore = Boolean(exploreAnchor);

  const handleOpenExplore = (event: React.MouseEvent<HTMLElement>) => {
    setExploreAnchor(event.currentTarget);
  };

  const handleCloseExplore = () => {
    setExploreAnchor(null);
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
        <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{
          width: "100%",
          top: 0,
          zIndex: 1200,
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)"
        }}
      >
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
            onClick={handleOpenExplore}
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
        <SearchInput />

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
            onClick={() => {
              if(user.roleName === "INSTRUCTOR") navigate("/instructor/course")
              if(user.roleName === "USER") {
                showToast("Vui lòng cập nhật hồ sơ của bạn để thành giảng viên")
                navigate("/instructor/profile")
              } 
            }}
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
              <Button
                color="inherit"
                onClick={() => navigate("/my-learning")}
                sx={{
                  display: { xs: "none", md: "inline-flex" },
                  fontSize: { xs: "12px", md: "14px" },
                  whiteSpace: "nowrap",
                  ...headerTextHover,
                }}
              >
                Học tập
              </Button>
              {/* NOTIFICATION */}
              <NotifyDropdown />
              {/* AVATAR */}
              <IconButton
                sx={{ p: 0 }}
                onClick={handleOpenMenu}
              >
                <Avatar
                  src={`${import.meta.env.VITE_CLOUDINARY_WATCH_IMG}/${user.avatarPath}`}
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
        <Popover
          open={openExplore}
          anchorEl={exploreAnchor}
          onClose={handleCloseExplore}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          PaperProps={{
            sx: {
              mt: 1,
              borderRadius: 2,
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              overflow: "visible",
            },
          }}
        >
          <HomeCategoryHeader />
        </Popover>
      </Toolbar>
    </AppBar>
  );
}
