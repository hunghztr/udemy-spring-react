import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Stack
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";
import type { ILearningResponse } from "@/type/course.module";

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
      onClick={() => navigate(`/learn/${course.id}`)}
      sx={{
        width: 280,
        borderRadius: 2,
        cursor: "pointer",
        transition: "0.2s",
        "&:hover": {
          boxShadow: 4,
          transform: "translateY(-2px)"
        }
      }}
    >

      {/* IMAGE */}
      <CardMedia
        component="img"
        image={imgSrc}
        alt={course.name}
        sx={{
          height: 150,
          objectFit: "cover"
        }}
      />

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
            <StarIcon sx={{ fontSize: 16, color: "#f4c150" }} />
            <Typography variant="caption">
              {course.star}
            </Typography>
          </Stack>
        </Stack>

      </CardContent>
    </Card>
  );
}