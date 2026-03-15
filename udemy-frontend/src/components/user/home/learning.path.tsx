"use client";

import { Box, Grid, Paper, Typography, Button } from "@mui/material";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function LearningPaths() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current || !cardsRef.current) return;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current!.children;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });

      // 1️⃣ Title
      tl.from(".learning-title", {
        y: 30,
        opacity: 0,
        duration: 0.5,
        ease: "power3.out",
      });

      // 2️⃣ Cards (journey effect)
      tl.from(
        cards,
        {
          x: 60,
          opacity: 0,
          stagger: 0.25,
          duration: 0.45,
          ease: "power3.out",
        },
        "-=0.15"
      );

      // 3️⃣ CTA buttons
      tl.from(
        ".learning-btn",
        {
          scale: 0.9,
          opacity: 0,
          duration: 0.3,
          ease: "back.out(1.7)",
          stagger: 0.15,
        },
        "-=0.2"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <Box
      ref={sectionRef}
      component="section"
      sx={{ px: 4, py: 6 }}
    >
      <Typography
        className="learning-title"
        variant="h4"
        fontWeight={700}
        mb={3}
      >
        Lộ trình học tập
      </Typography>

      <Grid ref={cardsRef} container spacing={3}>
        {[...Array(3)].map((_, i) => (
          <Grid size={{ xs: 12, md: 4 }} key={i}>
            <Paper
              sx={{
                p: 3,
                height: "100%",
                transition: "transform .25s ease, box-shadow .25s ease",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                },
              }}
            >
              <Typography fontWeight={600}>Java Backend</Typography>
              <Typography variant="body2">
                Java → Spring → Docker
              </Typography>
              <Button
                fullWidth
                sx={{ mt: 2 }}
                className="learning-btn"
              >
                Xem lộ trình
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}