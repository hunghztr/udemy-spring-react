import { useAppSelector } from "@/redux/hook";
import { Box, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

interface LoadMoreTriggerProps {
  onClick: () => void;
  label?: string;
}

export default function LoadMoreTrigger({
  onClick,
  label = "Xem thêm",
}: LoadMoreTriggerProps) {
  const pendingCount = useAppSelector(state => state.loading.pendingCount);
  const loading = pendingCount > 0;
  return (
    <Box textAlign="center" mt={2}>
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.2 }}
          >
            <motion.span
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: 6,
                lineHeight: 1,
                display: "inline-block",
              }}
            >
              ...
            </motion.span>
          </motion.div>
        ) : (
          <motion.div
            key="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Typography
              color="primary"
              sx={{ cursor: "pointer", fontWeight: 500 }}
              onClick={onClick}
            >
              {label}
            </Typography>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
