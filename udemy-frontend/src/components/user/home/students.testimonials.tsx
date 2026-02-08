import { fadeUp } from "@/helpers/variants";
import { Box, Paper, Stack, Typography, Avatar } from "@mui/material";
import { motion } from "framer-motion";

export default function StudentTestimonials() {
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
        Học viên nói gì?
      </Typography>

      <Stack direction="row" spacing={3} sx={{ overflowX: "auto" }}>
        {[...Array(4)].map((_, i) => (
          <Paper key={i} sx={{ p: 3, minWidth: 300 }}>
            <Typography variant="body2">
              “Khóa học rất dễ hiểu và thực tế.”
            </Typography>
            <Stack direction="row" spacing={1} mt={2}>
              <Avatar />
              <Typography fontWeight={600}>Trần Hùng</Typography>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}
