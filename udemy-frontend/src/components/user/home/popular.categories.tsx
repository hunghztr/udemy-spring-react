import { Box, Grid, Paper, Typography } from "@mui/material";
import { motion } from "framer-motion";

export default function PopularCategories() {
  return (
    <Box
      component={motion.section}
      // variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      sx={{ px: 4, py: 6 }}
    >
      <Typography variant="h4" fontWeight={700} mb={3}>
        Danh mục phổ biến
      </Typography>

      <Grid container spacing={3}>
        {[...Array(8)].map((_, i) => (
          <Grid size={{ xs: 12, md: 3 }} key={i}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography fontWeight={600}>IT</Typography>
              <Typography variant="body2">120+ khóa học</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
