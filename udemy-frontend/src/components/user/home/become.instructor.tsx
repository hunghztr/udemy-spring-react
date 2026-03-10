import { Box, Typography, Button } from "@mui/material";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

export default function BecomeInstructor() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });

      tl.fromTo(
        ".cta-bg",
        { scale: 1.12 },
        { scale: 1, duration: 1.1, ease: "power3.out" }
      )
        .from(
          ".cta-title",
          { y: 32, opacity: 0, duration: 0.6, ease: "power3.out" },
          "-=0.7"
        )
        .from(
          ".cta-subtitle",
          { y: 24, opacity: 0, duration: 0.5, ease: "power3.out" },
          "-=0.4"
        )
        .fromTo(
          ".cta-btn",
          { scale: 0.85, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.45,
            ease: "back.out(1.7)",
            immediateRender: false,
          },
          "-=0.25"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <Box
      ref={sectionRef}
      component="section"
      sx={{
        position: "relative",
        px: { xs: 3, md: 6 },
        py: { xs: 4, md: 10 },
        borderRadius: 4,
        overflow: "hidden",
        textAlign: "center",
        color: "primary.contrastText",
        mx: { xs: 2, md: 4 },
        my: { xs: 4, md: 6 },
      }}
    >
      {/* Background */}
      <Box
        className="cta-bg"
        sx={{
          position: "absolute",
          inset: 0,
          background: (theme) => theme.palette.banner.background,
          zIndex: 0,
        }}
      />

      {/* Light overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at top, rgba(255,255,255,0.25), transparent 60%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        onClick={() => navigate("/instructor/profile")}
      >
        <Typography
          className="cta-title"
          variant="h4"
          fontWeight={800}
          sx={{
            letterSpacing: 0.3,
          }}
        >
          Trở thành giảng viên
        </Typography>

        <Typography
          className="cta-subtitle"
          mt={2}
          sx={{
            opacity: 0.9,
            fontSize: { xs: 15, md: 16 },
            maxWidth: 520,
          }}
        >
          Chia sẻ kiến thức – tạo thu nhập bền vững
        </Typography>

        <Button
          className="cta-btn"
          variant="contained"
          color="primary"
          sx={{
            mt: 4,
            px: 4.5,
            py: 1.3,
            fontWeight: 700,
            borderRadius: 999,
            color: "primary.contrastText",
            boxShadow: "0 16px 40px rgba(0,0,0,0.35)",
            "&:hover": {
              bgcolor: "primary.dark",
              transform: "translateY(-3px)",
              boxShadow: "0 22px 50px rgba(0,0,0,0.45)",
            },
            transition: "all .25s ease",
          }}
        >
          Bắt đầu giảng dạy
        </Button>
      </Box>
    </Box>
  );
}
