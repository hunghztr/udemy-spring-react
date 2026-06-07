import { Box, Stack, Typography, useTheme } from "@mui/material";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { persistor } from "@/redux/store";
import { logOut } from "@/redux/thunks/auth.thunk";
import { showToast } from "@/utils/toast";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import NotifyIcon from "@/components/notification/notify.icon";

const menuItems = [
  { label: "Khoá học", icon: <SchoolOutlinedIcon />, path: "/instructor/course" },
  { label: "Thông báo", icon: <NotifyIcon />, path: "/instructor/notification" },
  { label: "Doanh thu", icon: <AccountBalanceWalletOutlinedIcon />, path: "/instructor/wallet" },
  { label: "Hồ sơ", icon: <PersonOutlineOutlinedIcon />, path: "/instructor/profile" },
];
const MotionBox = motion(Box);

export default function InstructorSidebar() {
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(state => state.currentUser)
  return (
    <MotionBox
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      sx={{
        height: "100vh",
        bgcolor: theme.palette.sidebar.main,
        color: theme.palette.sidebar.text,
        display: "flex",
        flexDirection: "column",
        borderRight: `1px solid ${theme.palette.action.disabledBackground}`,
        overflow: "hidden",
      }}
    >
      {/* ===== LOGO TEXT ===== */}
      <Box
        sx={{
          height: 56,
          px: 2,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Link to="/" style={{ textDecoration: "none", color: "white" }}>
          <Box
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              height: 26,
            }}
          >
            {/* U */}
            <Typography
              fontWeight={900}
              fontSize={26}
              lineHeight={1}
              sx={{ zIndex: 1, ml: "8px" }}
            >
              U
            </Typography>
            {/* DEMY */}
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    position: "absolute",
                    left: 30,
                    top: 0,
                    whiteSpace: "nowrap",
                  }}
                >
                  <Typography
                    fontWeight={900}
                    fontSize={26}
                    lineHeight={1}
                    letterSpacing={0.5}
                  >
                    DEMY
                  </Typography>
                </motion.span>
              )}
            </AnimatePresence>
          </Box>
        </Link>
      </Box>
      {/* ===== MENU ===== */}
      <Stack spacing={0.5} sx={{ p: 1, flex: 1 }}>
        {menuItems.map((item) => {
          const active = location.pathname.startsWith(item.path);
          return (
            <Stack
            onClick={() =>{
              if(item.path.includes("/instructor/course") && user.roleName !== "INSTRUCTOR" 
              && user.roleName !== "ADMIN"){
                  showToast("Vui lòng cập nhật hồ sơ của bạn để thành giảng viên")
                  navigate("/instructor/profile");
              }else{
                navigate(item.path)
              }
            }}
              key={item.label}
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{
                px: 2,
                py: 1.2,
                borderRadius: 2,
                textDecoration: "none",
                color: "white",
                bgcolor: active ? "rgba(255,255,255,0.12)" : "transparent",
                "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
              }}
            >
              <Box sx={{ minWidth: 24 }}>{item.icon}</Box>
              <AnimatePresence>
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Typography fontSize={14} fontWeight={600} whiteSpace="nowrap">
                      {item.label}
                    </Typography>
                  </motion.div>
                )}
              </AnimatePresence>
            </Stack>
          );
        })}
      </Stack>
      {/* ===== LOGOUT ===== */}
      <Box sx={{ p: 1 }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={(theme) => ({
            px: 2,
            py: 1.2,
            borderRadius: 2,
            cursor: "pointer",
            color: theme.palette.sidebar.text,
            opacity: 0.85,
            "&:hover": {
              bgcolor: theme.palette.sidebar.hover,
              color: theme.palette.sidebar.text,
              opacity: 1,
            },
          })}
          onClick={async () => {
                await persistor.purge();
                dispatch(logOut());
                navigate("/auth");
                showToast("Đăng xuất thành công");
          }}
        >
          <Box sx={{ minWidth: 24 }}>
            <LogoutOutlinedIcon />
          </Box>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
              >
                <Typography fontSize={14} fontWeight={600} whiteSpace="nowrap">
                  Đăng xuất
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>
        </Stack>
      </Box>
    </MotionBox>
  );
}
