"use client";

import { useTheme } from "@mui/material";
import { motion, useScroll } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const theme = useTheme();
  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: 3,
        width: "100%",
        background: theme.palette.primary.dark,
        transformOrigin: "0% 50%",
        scaleX: scrollYProgress,
        zIndex: 9999,
      }}
    />
  );
}
