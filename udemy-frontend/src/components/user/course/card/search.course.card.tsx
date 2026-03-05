import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Stack,
  Rating,
  Box,
  Skeleton,
} from "@mui/material";
import { useState } from "react";
import type { ICourseSearchResponse } from "@/type/course.module";
import { formatVnd } from "@/helpers/format.price";
import { slugify } from "@/helpers/slugify";

interface Props {
  course: ICourseSearchResponse;
}

export default function SearchCourseCard({ course }: Props) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleClick = () => {
    const slug = slugify(course.name);
    window.open(`/course/${slug}-${course.id}.html`, "_blank");
  };
  return (
    <Card
      onClick={handleClick}
      sx={{
        height: "100%",
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        transition: "all .25s ease",

        "&:hover": {
          boxShadow: 6,
          transform: "translateY(-4px)",
        },
      }}
    >
      {/* ===== IMAGE WRAPPER ===== */}
      <Box sx={{ position: "relative", height: 170 }}>
        {/* Skeleton / Blur */}
        {(!imgLoaded || imgError) && (
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            sx={{
              position: "absolute",
              inset: 0,
              filter: "blur(6px)",
              transform: "scale(1.05)",
            }}
          />
        )}

        {/* IMAGE */}
        <CardMedia
          component="img"
          height="170"
          image={`${import.meta.env.VITE_CLOUDINARY_WATCH_IMG}/${course.imagePath}`}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
          sx={{
            objectFit: "cover",
            opacity: imgLoaded && !imgError ? 1 : 0,
            transition: "opacity .4s ease",
          }}
        />
      </Box>

      {/* ===== CONTENT ===== */}
      <CardContent sx={{ p: 2, display: "flex", flexDirection: "column" }}>
        <Stack spacing={1} flexGrow={1}>
          {/* NAME */}
          <Typography fontWeight={700} fontSize={15} lineHeight={1.3}
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {course.name}
          </Typography>

          {/* DESCRIPTION */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {course.description}
          </Typography>

          {/* AUTHOR */}
          <Typography variant="caption" color="text.secondary">
            {course.authorName}
          </Typography>

          {/* META */}
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography fontWeight={700}>
              {course.rating.toFixed(1)}
            </Typography>
            <Rating value={course.rating} precision={0.5} readOnly size="small" />
            <Typography variant="caption" color="text.secondary">
              ({course.sold.toLocaleString()})
            </Typography>
            <Typography variant="caption" color="text.secondary">
              • {course.hour} total hours
            </Typography>
          </Stack>
        </Stack>

        {/* PRICE */}
        <Box mt={1}>
          <Typography fontWeight={800} fontSize={16}>
            {formatVnd(course.price)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
