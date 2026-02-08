import { fadeUp } from "@/helpers/variants";
import { Box, Paper, Stack, Typography, Avatar } from "@mui/material";
import { motion } from "framer-motion";

export default function TopInstructors() {
  return (
    <Box
      component={motion.section}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      sx={{ px: 4, py: 6 }}
    >
      <Typography variant="h4" fontWeight={700} mb={3}>
        Giảng viên nổi bật
      </Typography>

      <Stack direction="row" spacing={3} sx={{ overflowX: "auto" }}>
        {[...Array(5)].map((_, i) => (
          <Paper key={i} sx={{ p: 3, minWidth: 220, textAlign: "center" }}>
            <Avatar sx={{ mx: "auto", mb: 1 }} />
            <Typography fontWeight={600}>Nguyễn Văn A</Typography>
            <Typography variant="body2">Java • Spring</Typography>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}
