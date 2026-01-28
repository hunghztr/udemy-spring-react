import { Box, Stack, Typography } from "@mui/material";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined"; // ✅ PROFILE ICON

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { label: "Courses", icon: <SchoolOutlinedIcon />, path: "/instructor/course" },
  { label: "Communication", icon: <ChatBubbleOutlineOutlinedIcon />, path: "/instructor/communication" },
  { label: "Performance", icon: <BarChartOutlinedIcon />, path: "/instructor/performance" },
  { label: "Tools", icon: <BuildOutlinedIcon />, path: "/instructor/tools" },
  { label: "Resources", icon: <HelpOutlineOutlinedIcon />, path: "/instructor/resources" },

  // ✅ NEW PROFILE MENU
  { label: "Profile", icon: <PersonOutlineOutlinedIcon />, path: "/instructor/profile" },
];

const MotionBox = motion(Box);

export default function InstructorSidebar() {
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();

  return (
    <MotionBox
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      sx={{
        height: "100vh",
        bgcolor: "#111116",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid rgba(255,255,255,0.08)",
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
              key={item.label}
              component={Link}
              to={item.path}
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
    </MotionBox>
  );
}
