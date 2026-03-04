"use client";

import { Box, Grid, Typography, Tabs, Tab } from "@mui/material";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function TopCoursesByField() {
  const [tab, setTab] = useState(0);

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  /* ===============================
   * 1️⃣ Scroll trigger cho section
   * =============================== */
  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".top-course-header", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      });

      gsap.from(".top-course-tabs", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
        y: 20,
        opacity: 0,
        duration: 0.5,
        delay: 0.1,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* =========================================
   * 2️⃣ Animate grid mỗi lần đổi tab (IDEA 2)
   * ========================================= */
  useLayoutEffect(() => {
    if (!gridRef.current) return;

    // hướng animation theo tab
    const directionMap: Record<number, { x: number; y: number }> = {
      0: { x: -40, y: 0 }, // IT → từ trái
      1: { x: 0, y: 40 },  // Marketing → từ dưới
      2: { x: 40, y: 0 },  // Ngoại ngữ → từ phải
    };

    const { x, y } = directionMap[tab];

    gsap.fromTo(
      gridRef.current.children,
      {
        opacity: 0,
        x,
        y,
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        stagger: 0.1,
        duration: 0.45,
        ease: "power3.out",
        clearProps: "transform",
      }
    );
  }, [tab]);

  return (
    <Box
      ref={sectionRef}
      component="section"
      sx={{ px: 4, py: 6 }}
    >
      {/* HEADER */}
      <Typography
        className="top-course-header"
        variant="h4"
        fontWeight={700}
        mb={2}
      >
        Top khóa học theo lĩnh vực
      </Typography>

      {/* TABS */}
      <Tabs
        className="top-course-tabs"
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ mb: 2 }}
      >
        <Tab label="IT" />
        <Tab label="Marketing" />
        <Tab label="Ngoại ngữ" />
      </Tabs>

      {/* GRID */}
      <Grid ref={gridRef} container spacing={3}>
        {[...Array(4)].map((_, i) => (
          <Grid size={{ xs: 12, md: 3 }} key={`${tab}-${i}`}>
            <Box
              sx={{
                height: 160,
                bgcolor: "grey.200",
                borderRadius: 2,
                transition: "box-shadow .25s, transform .25s",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                },
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}