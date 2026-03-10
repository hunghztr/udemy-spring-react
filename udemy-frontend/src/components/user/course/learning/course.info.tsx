import { Box, Typography, Stack, Chip, Divider } from "@mui/material";
import type { ICourseInfoResponse } from "@/type/course.module";

interface Props {
  course: ICourseInfoResponse;
}

export default function CourseInfo({ course }: Props) {

  return (
    <Box sx={{ mt: 3 }}>

      {/* Title */}
      <Typography variant="h5" fontWeight={700}>
        {course.name}
      </Typography>

      {/* Author + rating */}
      <Stack direction="row" spacing={2} mt={1} alignItems="center">

        <Typography color="text.secondary">
          Created by <b>{course.author.fullname}</b>
        </Typography>

        <Typography color="text.secondary">
          ⭐ {course.star}
        </Typography>

        <Typography color="text.secondary">
          👨‍🎓 {course.sold} students
        </Typography>

      </Stack>

      {/* Categories */}
      <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">

        {course.categories.map((c) => (
          <Chip
            key={c.id}
            label={c.name}
            size="small"
          />
        ))}

      </Stack>

      <Divider sx={{ my: 3 }} />

      {/* Description */}
      <Typography variant="h6" fontWeight={600} mb={1}>
        Description
      </Typography>

      <Typography color="text.secondary">
        {course.description}
      </Typography>

      <Divider sx={{ my: 3 }} />

      {/* Requirement */}
      <Typography variant="h6" fontWeight={600} mb={1}>
        Requirements
      </Typography>

      <Typography color="text.secondary">
        {course.requirement}
      </Typography>

    </Box>
  );
}