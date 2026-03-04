
import { Box, Paper, Stack, Typography, Avatar } from "@mui/material";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function TopInstructors() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current!;

      const scrollWidth = track.scrollWidth;
      const containerWidth = track.offsetWidth;
      const distance = scrollWidth - containerWidth;

      // không cần animate nếu không overflow
      if (distance <= 0) return;

      gsap.to(track, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: `+=${scrollWidth}`,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <Box
      ref={sectionRef}
      component="section"
      sx={{
        px: 4,
        py: 6,
        overflow: "hidden", // QUAN TRỌNG
      }}
    >
      <Typography variant="h4" fontWeight={700} mb={3}>
        Giảng viên nổi bật
      </Typography>

      <Stack
        ref={trackRef}
        direction="row"
        spacing={3}
        sx={{
          willChange: "transform",
        }}
      >
        {[...Array(5)].map((_, i) => (
          <Paper
            key={i}
            sx={{
              p: 3,
              minWidth: 220,
              textAlign: "center",
              cursor: "pointer",
              transition: "transform .25s ease, box-shadow .25s ease",
              "&:hover": {
                transform: "translateY(-6px) scale(1.03)",
                boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
              },
            }}
          >
            <Avatar
              sx={{
                mx: "auto",
                mb: 1,
                width: 64,
                height: 64,
              }}
            />
            <Typography fontWeight={600}>Nguyễn Văn A</Typography>
            <Typography variant="body2">Java • Spring</Typography>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}