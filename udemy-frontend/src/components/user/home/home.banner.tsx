import {
  Box,
  Stack,
  Typography,
  Paper,
  useTheme,
} from "@mui/material";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";
import AnimatedWaves from "./animate.wave";
import person1 from "@/assets/person1.png";
import person2 from "@/assets/person2.png";

export default function HomeBanner() {
  const theme = useTheme();
  const MotionPaper = motion(Paper);

  /* ================= PARALLAX ================= */

  const dirX = useMotionValue(0);
  const dirY = useMotionValue(0);

  const smoothX = useSpring(dirX, { stiffness: 120, damping: 20 });
  const smoothY = useSpring(dirY, { stiffness: 120, damping: 20 });

  const xSmall = useTransform(smoothX, [-1, 1], [-8, 8]);
  const ySmall = useTransform(smoothY, [-1, 1], [-8, 8]);

  const xMedium = useTransform(smoothX, [-1, 1], [-16, 16]);
  const yMedium = useTransform(smoothY, [-1, 1], [-16, 16]);

  const xLarge = useTransform(smoothX, [-1, 1], [-24, 24]);
  const yLarge = useTransform(smoothY, [-1, 1], [-24, 24]);

  return (
    <Box
      sx={{
        minHeight: 640,
        pb: 14,
        px: { xs: 3, md: 8 },
        py: 6,
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" },
        alignItems: "center",
        gap: 6,
        color: "common.white",
        background: theme.palette.banner.background,
        overflow: "hidden",
        position: "relative",
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);

        dirX.set(Math.max(-1, Math.min(1, dx)));
        dirY.set(Math.max(-1, Math.min(1, dy)));
      }}
      onMouseLeave={() => {
        dirX.set(0);
        dirY.set(0);
      }}
    >
      {/* ================= LEFT ================= */}

      <Stack
      component={motion.div}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.2,
          },
        },
      }}
      spacing={3}
    >
      {/* TITLE */}

      <Typography
        component={motion.h1}
        variants={{
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        sx={{
          maxWidth: 720,
          fontFamily: "'Inter', 'Be Vietnam Pro', sans-serif",
          fontWeight: 700,
          lineHeight: 1.3,
          letterSpacing: "-0.5px",
          fontSize: {
            xs: "28px",
            sm: "36px",
            md: "48px",
            lg: "56px",
          },
        }}
      >
        Nền tảng học trực tuyến
        <br />
        từ cơ bản đến nâng cao
      </Typography>

      {/* SUBTITLE */}

      <Typography
        component={motion.p}
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.6 }}
        sx={{
          color: "rgba(255,255,255,0.85)",
          fontSize: 18,
          maxWidth: 520,
          lineHeight: 1.6,
        }}
      >
        Khám phá hàng nghìn khóa học thực tế từ các chuyên gia
        trong ngành. Học theo lộ trình rõ ràng, cập nhật liên tục
        và truy cập trọn đời.
      </Typography>

      {/* CTA TEXT */}

      <Stack
        component={motion.div}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.5 }}
        spacing={1}
        mt={1}
      >
        <Typography
          sx={{
            fontWeight: 600,
            cursor: "pointer",
            color: "#fff",
            fontSize: 18,
            transition: "0.2s",
            "&:hover": {
              color: theme.palette.primary.light,
              transform: "translateX(4px)",
            },
          }}
        >
          Khám phá khóa học →
        </Typography>
      </Stack>

      {/* FEATURES */}

      <Stack
        component={motion.div}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
        transition={{ duration: 0.8 }}
        direction="row"
        spacing={4}
        mt={3}
        flexWrap="wrap"
      >
        {[
          "Video bài giảng theo yêu cầu",
          "Cập nhật nội dung liên tục",
          "Truy cập trọn đời",
        ].map((item) => (
          <Stack direction="row" spacing={1} key={item}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: theme.palette.primary.light,
                mt: 1,
              }}
            />
            <Typography fontSize={14}>{item}</Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>

      {/* ================= RIGHT ================= */}

      <Box sx={{ position: "relative", height: 420 }}>
        {/* MAIN CARD */}

        <MotionPaper
          style={{ x: xLarge, y: yLarge }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          sx={{
            width: 260,
            height: 340,
            borderRadius: 4,
            position: "absolute",
            right: 80,
            top: 40,
            overflow: "hidden",
            boxShadow: theme.shadows[10],
          }}
        >
          <Box
            component="img"
            src={person1}
            alt="Student"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </MotionPaper>

        {/* SMALL CARD */}

        <MotionPaper
          style={{ x: xMedium, y: yMedium }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          sx={{
            width: 160,
            height: 200,
            borderRadius: 4,
            position: "absolute",
            right: 0,
            top: 0,
            overflow: "hidden",
            boxShadow: theme.shadows[6],
          }}
        >
          <Box
            component="img"
            src={person2}
            alt="Instructor"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </MotionPaper>

        {/* STAT */}

        <MotionPaper
          style={{ x: xSmall, y: ySmall }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          sx={{
            px: 3,
            py: 2,
            position: "absolute",
            bottom: 40,
            left: 40,
            borderRadius: 3,
          }}
        >
          <Typography fontWeight={700} color={theme.palette.primary.main}>
            3.000+
          </Typography>
          <Typography fontSize={14}>Khóa học trực tuyến</Typography>
        </MotionPaper>
      </Box>

      <AnimatedWaves />
    </Box>
  );
}