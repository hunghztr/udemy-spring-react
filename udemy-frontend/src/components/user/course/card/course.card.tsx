import { slugify } from "@/helpers/slugify";
import type { ICourseSearchResponse } from "@/type/course.module";
import { Box, Typography } from "@mui/material";
import { useState } from "react";

function CourseCard({ course }: { course: ICourseSearchResponse }) {
  const [loaded, setLoaded] = useState(false);

  const imgSrc = course.imagePath
    ? course.imagePath.startsWith("blob:")
      ? course.imagePath
      : `${import.meta.env.VITE_CLOUDINARY_WATCH_IMG}/${course.imagePath}`
    : undefined;

  const handleClick = () => {
    const slug = slugify(course.name);
    window.open(`/course/${slug}-${course.id}.html`, "_blank");
  };

  return (
    <Box
      onClick={handleClick}
      sx={(theme) => ({
        bgcolor: "background.paper",
        borderRadius: 3,
        overflow: "hidden",
        border: `1px solid ${theme.palette.divider}`,
        cursor: "pointer",
        transition: "all .25s",
        height: "100%",
        display: "flex",
        flexDirection: "column",

        // shadow nhẹ mặc định
        boxShadow: theme.shadows[1],

        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: theme.shadows[6],
          borderColor: theme.palette.primary.main
        }
      })}
    >
      {/* IMAGE */}
      <Box
        sx={{
          position: "relative",
          height: 150,
          overflow: "hidden",
          bgcolor: "grey.200"
        }}
      >
        {/* BLUR PLACEHOLDER */}
        {/* REAL IMAGE */}
        {imgSrc && (
          <Box
            component="img"
            src={imgSrc}
            alt={course.name}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "relative",
              opacity: loaded ? 1 : 0,
              transition: "opacity .4s, transform .4s",

              ".MuiBox-root:hover &": {
                transform: "scale(1.06)"
              }
            }}
          />
        )}

        {/* REAL IMAGE */}
        <Box
          component="img"
          src={imgSrc}
          alt={course.name}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "relative",
            opacity: loaded ? 1 : 0,
            transition: "opacity .4s, transform .4s",

            ".MuiBox-root:hover &": {
              transform: "scale(1.06)"
            }
          }}
        />

        {/* GRADIENT OVERLAY */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0) 65%, rgba(0,0,0,0.18))"
          }}
        />
      </Box>

      {/* CONTENT */}
      <Box sx={{ p: 1.5, flexGrow: 1 }}>
        {/* COURSE NAME */}
        <Typography
          fontSize={14}
          fontWeight={700}
          lineHeight={1.3}
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            mb: 0.5
          }}
        >
          {course.name}
        </Typography>

        {/* AUTHOR */}
        <Typography
          fontSize={12}
          color="text.secondary"
          sx={{ mb: 0.5 }}
        >
          {course.authorName}
        </Typography>

        {/* RATING */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            mb: 0.5
          }}
        >
          <Typography
            fontSize={12}
            fontWeight={700}
            color="warning.main"
          >
            {course.star.toFixed(1)}
          </Typography>

          <Typography fontSize={12}>⭐</Typography>

          <Typography fontSize={12} color="text.secondary">
            ({course.sold})
          </Typography>
        </Box>

        {/* PRICE */}
        <Typography
          fontWeight={800}
          fontSize={16}
          color="primary.main"
        >
          ₫{course.price.toLocaleString()}
        </Typography>
      </Box>
    </Box>
  );
}

export default CourseCard;