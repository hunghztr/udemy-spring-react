import { fadeUp } from "@/helpers/variants";
import { Box, Grid, Typography, Tabs, Tab } from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";

export default function TopCoursesByField() {
  const [tab, setTab] = useState(0);

  return (
    <Box
      component={motion.section}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      sx={{ px: 4, py: 6 }}
    >
      <Typography variant="h4" fontWeight={700} mb={2}>
        Top khóa học theo lĩnh vực
      </Typography>

      <Tabs value={tab} onChange={(_, v) => setTab(v)}>
        <Tab label="IT" />
        <Tab label="Marketing" />
        <Tab label="Ngoại ngữ" />
      </Tabs>

      <Grid container spacing={3} mt={2}>
        {[...Array(4)].map((_, i) => (
          <Grid size={{ xs: 12, md: 3 }} key={i}>
            <Box sx={{ height: 160, bgcolor: "grey.200", borderRadius: 2 }} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
