import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Stack,
  IconButton
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import { useNavigate } from "react-router-dom";
import { slugify } from "@/helpers/slugify";
import type { ILearningResponse } from "@/type/learning.module";

interface Props {
  course: ILearningResponse;
}

export default function LearningCard({ course }: Props) {

  const navigate = useNavigate();

  const imgSrc = course.imagePath
    ? course.imagePath.startsWith("blob:")
      ? course.imagePath
      : `${import.meta.env.VITE_CLOUDINARY_WATCH_IMG}/${course.imagePath}`
    : undefined;

  return (
    <Card
      onClick={() => {
        const slug = slugify(course.name);
        navigate(`/learn/${slug}-${course.id}.html`)
      }}
      sx={{
        width: 280,
        borderRadius: 2,
        cursor: "pointer",
        transition: "0.2s",
        overflow: "hidden",

        "&:hover": {
          boxShadow: 4,
          transform: "translateY(-2px)"
        },

        "&:hover .card-img": {
          filter: "blur(3px)",
          transform: "scale(1.06)"
        },

        "&:hover .play-overlay": {
          opacity: 1
        }
      }}
    >

      {/* IMAGE */}
      <Box
        sx={{
          position: "relative",
          height: 150,
          overflow: "hidden"
        }}
      >

        <CardMedia
          component="img"
          image={imgSrc}
          alt={course.name}
          className="card-img"
          sx={{
            height: "100%",
            width: "100%",
            objectFit: "cover",
            transition: "all 0.35s ease"
          }}
        />

        {/* PLAY OVERLAY */}
        <Box
          className="play-overlay"
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.35)",
            opacity: 0,
            transition: "opacity 0.25s ease"
          }}
        >
          <IconButton
            sx={{
              color: "commom.white",
              background: "rgba(0,0,0,0.55)",
              "&:hover": {
                background: "rgba(0,0,0,0.7)"
              }
            }}
          >
            <PlayCircleFilledIcon sx={{ fontSize: 50 }} />
          </IconButton>
        </Box>

      </Box>

      <CardContent sx={{ p: 1.5 }}>

        {/* TITLE */}
        <Typography
          fontWeight={600}
          fontSize={15}
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}
        >
          {course.name}
        </Typography>

        {/* PROGRESS BAR */}
        <Box sx={{ mt: 1 }}>
          <LinearProgress
            variant="determinate"
            value={course.progress}
            sx={{
              height: 4,
              borderRadius: 2,
              "& .MuiLinearProgress-bar": {
                backgroundColor: "primary.main"
              }
            }}
          />
        </Box>

        {/* FOOTER */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mt: 0.8 }}
        >
          <Typography variant="caption" fontWeight={500}>
            {course.progress}% complete
          </Typography>

          <Stack direction="row" alignItems="center" spacing={0.3}>
            <StarIcon sx={{ fontSize: 16, color: "warning.main" }} />
            <Typography variant="caption">
              {course.star}
            </Typography>
          </Stack>
        </Stack>

      </CardContent>
    </Card>
  );
}