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

import type { IFilterRequest } from "@/type/course.module";
import FilterForm from "./filter.form";
import { useState } from "react";

const MotionBox = motion(Box);

interface Props {
  filters: IFilterRequest | undefined;
  setFilters: React.Dispatch<React.SetStateAction<IFilterRequest | undefined>>;
}

export default function FilterDrawer({ filters, setFilters }: Props) {
  const [open, setOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const handleOpen = () => { setShowOverlay(true); setOpen(true); };
  const handleClose = () => {
    setShowOverlay(false);
    setTimeout(() => setOpen(false), 150);
  };

  return (
    <>
      <Chip icon={<TuneIcon />} label="Bộ lọc" onClick={handleOpen}
        sx={{ mb: 3, px: 1.5, py: 2.5, fontWeight: 600, borderRadius: 999,
              border: "1px solid", borderColor: "divider" }}
      />
      <AnimatePresence>
        {showOverlay && (
          <Backdrop open onClick={handleClose}
            sx={{ zIndex: 1200, backdropFilter: "blur(6px)", backgroundColor: "rgba(0,0,0,0.25)" }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {open && (
          <MotionBox
            initial={{ x: -420 }} animate={{ x: 0 }} exit={{ x: -420 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            sx={{ position: "fixed", top: 0, left: 0, width: 360, height: "100vh",
                  zIndex: 1300, backgroundColor: "background.paper", boxShadow: 10,
                  display: "flex", flexDirection: "column" }}
          >
            {/* HEADER */}
            <Box sx={{ px: 2, py: 1.5, display: "flex", justifyContent: "space-between",
                        borderBottom: "1px solid", borderColor: "divider" }}>
              <Typography fontWeight={700}>Bộ lọc khóa học</Typography>
              <IconButton onClick={handleClose}><CloseIcon /></IconButton>
            </Box>

            {/* FORM — key=JSON.stringify(filters) để re-mount mỗi khi filters thay đổi */}
            <FilterForm
              key={JSON.stringify(filters)}
              filters={filters}
              setFilters={setFilters}
              onClose={handleClose}
            />
          </MotionBox>
        )}
      </AnimatePresence>
    </>
  );
}