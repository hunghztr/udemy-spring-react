import {
  Box,
  Button,
  Typography,
  Paper,
  Stack,
  Container
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { query } from "@/main";

const MotionPaper = motion(Paper);
const MotionBox = motion(Box);
const MotionButton = motion(Button);

export default function PaySuccessPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  // xoá cache my learning
  query.invalidateQueries({
              predicate: (q) =>
                q.queryKey[0]?.toString().startsWith("learnings/get-all") ?? false
            });
  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: theme.palette.banner.highlight,
        px: 2
      }}
    >
      <Container maxWidth="sm">
        <MotionPaper
          elevation={6}
          initial={{ scale: 0.8, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 12 }}
          sx={{
            p: 5,
            borderRadius: 4,
            textAlign: "center"
          }}
        >
          <Stack spacing={3} alignItems="center">

            {/* Icon success */}
            <MotionBox
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <CheckCircleRoundedIcon
                sx={{
                  fontSize: 80,
                  color: theme.palette.primary.main
                }}
              />
            </MotionBox>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Typography variant="h4" fontWeight={700}>
                Thanh toán thành công 🎉
              </Typography>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Typography color="text.secondary">
                Khóa học của bạn đã được kích hoạt.
                Bạn có thể bắt đầu học ngay bây giờ.
              </Typography>
            </motion.div>

            {/* Buttons */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ pt: 2 }}
            >
              <MotionButton
                variant="outlined"
                size="large"
                whileHover={{ y: -3, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={() => navigate("/")}
              >
                Về trang chủ
              </MotionButton>

              <MotionButton
                variant="contained"
                size="large"
                whileHover={{
                  y: -4,
                  scale: 1.05,
                  boxShadow: "0px 10px 25px rgba(0,0,0,0.2)"
                }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={() => navigate("/my-courses")}
                sx={{ px: 4 }}
              >
                Bắt đầu học
              </MotionButton>
            </Stack>

            {/* Footer note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ pt: 2 }}
              >
                Nếu gặp vấn đề với khóa học, vui lòng liên hệ hỗ trợ.
              </Typography>
            </motion.div>

          </Stack>
        </MotionPaper>
      </Container>
    </MotionBox>
  );
}