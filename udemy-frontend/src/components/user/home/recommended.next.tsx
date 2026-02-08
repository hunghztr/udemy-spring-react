import { fadeUp } from "@/helpers/variants";
import { Box, Paper, Stack, Typography, Chip } from "@mui/material";
import { motion } from "framer-motion";

export default function RecommendedNext() {
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
        Bạn nên học gì tiếp theo?
      </Typography>

      <Stack direction="row" spacing={2} sx={{ overflowX: "auto" }}>
        {[...Array(4)].map((_, i) => (
          <Paper key={i} sx={{ p: 3, minWidth: 280 }}>
            <Chip label="Gợi ý" size="small" color="secondary" />
            <Typography fontWeight={600} mt={1}>
              Spring Boot
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tiếp nối sau Java
            </Typography>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}
