
import { Box, Grid, Paper, Typography } from "@mui/material";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function PopularCategories() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

      tl.from(".category-title", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      });

      tl.from(".category-card", {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
        ease: "power3.out",
      }, "-=0.2");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <Box ref={sectionRef} component="section" sx={{ px: 4, py: 6 }}>
      <Typography
        className="category-title"
        variant="h4"
        fontWeight={700}
        mb={3}
      >
        Danh mục phổ biến
      </Typography>

      <Grid container spacing={3}>
        {[...Array(8)].map((_, i) => (
          <Grid size={{ xs: 12, md: 3 }} key={i}>
            <Paper className="category-card" sx={{ p: 3, textAlign: "center" }}>
              <Typography fontWeight={600}>IT</Typography>
              <Typography variant="body2">120+ khóa học</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}