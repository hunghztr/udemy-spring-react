import useEmblaCarousel from "embla-carousel-react";
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CourseCard from "./card/course.card";

export default function FeaturedCourses() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    dragFree: true
  });

  return (
    <Box sx={{ px: 4, py: 6 }}>
      {/* ===== TITLE ===== */}
      <Typography variant="h4" fontWeight={700} mb={2}>
        Khóa học nổi bật
      </Typography>

      {/* ===== CAROUSEL WRAPPER ===== */}
      <Box sx={{ position: "relative" }}>
        {/* ===== PREV BUTTON ===== */}
        <IconButton
          onClick={() => emblaApi?.scrollPrev()}
          sx={{
            position: "absolute",
            top: "50%",
            left: -20,
            transform: "translateY(-50%)",
            bgcolor: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,.2)",
            zIndex: 2,
            "&:hover": { bgcolor: "#fff" },
            display: { xs: "none", md: "flex" }
          }}
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>

        {/* ===== NEXT BUTTON ===== */}
        <IconButton
          onClick={() => emblaApi?.scrollNext()}
          sx={{
            position: "absolute",
            top: "50%",
            right: -20,
            transform: "translateY(-50%)",
            bgcolor: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,.2)",
            zIndex: 2,
            "&:hover": { bgcolor: "#fff" },
            display: { xs: "none", md: "flex" }
          }}
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>

        {/* ===== VIEWPORT ===== */}
        <Box ref={emblaRef} sx={{ overflow: "hidden" }}>
          {/* ===== TRACK ===== */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "nowrap"
            }}
          >
            {[...Array(12)].map((_, i) => (
              <Box
                key={i}
                sx={{
                  flex: {
                    xs: "0 0 80%",
                    sm: "0 0 45%",
                    md: "0 0 20%" // 5 item desktop
                  },
                  minWidth: 0
                }}
              >
                <CourseCard />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
