import { fadeUp } from "@/helpers/variants";
import { Box, Grid, Paper, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";

export default function LearningPaths() {
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
        Lộ trình học tập
      </Typography>

      <Grid container spacing={3}>
        {[...Array(3)].map((_, i) => (
          <Grid size={{ xs: 12, md: 4 }} key={i}>
            <Paper sx={{ p: 3 }}>
              <Typography fontWeight={600}>Java Backend</Typography>
              <Typography variant="body2">Java → Spring → Docker</Typography>
              <Button fullWidth sx={{ mt: 2 }}>
                Xem lộ trình
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
