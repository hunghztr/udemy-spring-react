import useEmblaCarousel from "embla-carousel-react";
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { motion } from "framer-motion";
import { fadeUp } from "@/helpers/variants";
import { getRecommend } from "@/query/user/user.query";
import type { ICourseSearchResponse } from "@/type/course.module";
import CourseCard from "../course/card/course.card";

export default function RecommendedNext() {
  const { data: courses } = getRecommend();

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    slidesToScroll: 1
  });
  if(!courses || courses.length === 0) return null;
  return (
    <Box
      component={motion.section}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      sx={{ px: 4, py: 6 }}
    >
      {/* TITLE */}
      <Typography variant="h4" fontWeight={700} mb={2}>
        Bạn nên học gì tiếp theo?
      </Typography>

      <Box sx={{ position: "relative" }}>
        {/* PREV */}
        <IconButton
          onClick={() => emblaApi?.scrollPrev()}
          sx={{
            position: "absolute",
            top: "50%",
            left: -20,
            transform: "translateY(-50%)",
            bgcolor: "background.paper",
            boxShadow: 2,
            zIndex: 2,
            "&:hover": { bgcolor: "background.paper" },
            display: { xs: "none", md: "flex" }
          }}
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>

        {/* NEXT */}
        <IconButton
          onClick={() => emblaApi?.scrollNext()}
          sx={{
            position: "absolute",
            top: "50%",
            right: -20,
            transform: "translateY(-50%)",
            bgcolor: "background.paper",
            boxShadow: 2,
            zIndex: 2,
            "&:hover": { bgcolor: "background.paper" },
            display: { xs: "none", md: "flex" }
          }}
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>

        {/* VIEWPORT */}
        <Box ref={emblaRef} sx={{ overflow: "hidden" }}>
          {/* TRACK */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "nowrap"
            }}
          >
            {courses?.map((course: ICourseSearchResponse) => (
              <Box
                key={course.id}
                sx={{
                  flex: {
                    xs: "0 0 80%",
                    sm: "0 0 45%",
                    md: "0 0 20%"
                  },
                  minWidth: 0
                }}
              >
                <CourseCard course={course} />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}