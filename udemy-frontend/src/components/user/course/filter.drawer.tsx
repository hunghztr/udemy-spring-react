import {
  Box,
  Typography,
  IconButton,
  Chip,
  Backdrop,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TuneIcon from "@mui/icons-material/Tune";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const MotionBox = motion(Box);

export default function FilterDrawer() {
  const [open, setOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const handleOpen = () => {
    setShowOverlay(true);
    setOpen(true);
  };

  const handleClose = () => {
    setShowOverlay(false);
    setTimeout(() => {
      setOpen(false);
    }, 150);
  };

  return (
    <>
      {/* ===== FILTER BUTTON ===== */}
      <Chip
        icon={<TuneIcon />}
        label="Bộ lọc"
        onClick={handleOpen}
        sx={{
          mb: 3,
          px: 1.5,
          py: 2.5,
          fontWeight: 600,
          borderRadius: 999,
          border: "1px solid",
          borderColor: "divider",
        }}
      />

      {/* ===== OVERLAY ===== */}
      <AnimatePresence>
        {showOverlay && (
          <Backdrop
            open
            onClick={handleClose}
            sx={{
              zIndex: 1200,
              backdropFilter: "blur(6px)",
              backgroundColor: "rgba(0,0,0,0.25)",
            }}
          />
        )}
      </AnimatePresence>

      {/* ===== DRAWER ===== */}
      <AnimatePresence>
        {open && (
          <MotionBox
            initial={{ x: -420 }}
            animate={{ x: 0 }}
            exit={{ x: -420 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: 360,
              height: "100vh",
              zIndex: 1300,
              backgroundColor: "background.paper",
              boxShadow: 10,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* HEADER */}
            <Box
              sx={{
                px: 2,
                py: 1.5,
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography fontWeight={700}>Bộ lọc</Typography>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* BODY */}
            <Box sx={{ p: 2, overflowY: "auto", flexGrow: 1 }}>
              {/* nội dung filter */}
            </Box>
          </MotionBox>
        )}
      </AnimatePresence>
    </>
  );
}

