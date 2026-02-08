import { fadeUp } from "@/helpers/variants";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";

export default function WhyChooseUs() {
  return (
    <Box
      component={motion.section}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      sx={{ px: 4, py: 6 }}
    >
      <Grid container spacing={3}>
        {[...Array(4)].map((_, i) => (
          <Grid size={{ xs: 12, md: 3 }} key={i}>
            <Stack alignItems="center" spacing={1}>
              <Box sx={{ width: 48, height: 48, bgcolor: "grey.300", borderRadius: "50%" }} />
              <Typography fontWeight={600}>Truy cập trọn đời</Typography>
              <Typography variant="body2" align="center">
                Học mọi lúc mọi nơi
              </Typography>
            </Stack>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
