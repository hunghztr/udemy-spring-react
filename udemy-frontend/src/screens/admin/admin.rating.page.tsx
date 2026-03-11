import { getCourseInfo } from "@/query/course/course.query";
import { deleteRating, useUserReport } from "@/query/learning/rating.query";
import { useGetById, useSave } from "@/query/use.crud.query";
import type { ICourseInfoResponse } from "@/type/course.module";

import { useParams, useSearchParams } from "react-router-dom";

import {
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  Divider,
  Button,
  Rating,
  Box
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import { slugify } from "@/helpers/slugify";

export default function AdminRatingPage() {
  const { courseId } = useParams();
  const [param] = useSearchParams();

  const userId = param.get("watchReport");

  const { data: course } = useGetById<ICourseInfoResponse>(
    "courses/getCourse-by-id",
    getCourseInfo,
    courseId || ""
  );

  const imgSrc = course?.imagePath
    ? course.imagePath.startsWith("blob:")
      ? course.imagePath
      : `${import.meta.env.VITE_CLOUDINARY_WATCH_IMG}/${course.imagePath}`
    : undefined;

  const { data: rating } = useUserReport(userId || "", courseId || "");
  const {mutate} = useSave<boolean,{userId:string|null,courseId:string|undefined}
  >('ratings/remove',deleteRating);
  const handleDelete = () => {
    mutate({
      userId,courseId
    },{
      onSuccess:() =>{
        window.close();
      }
    })
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={4}>
        {/* COURSE INFO */}
        {course && (
          <Card>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={3}
              sx={{ p: 2 }}
            >
              {/* IMAGE 16:9 */}
              <Box sx={{ width: { xs: "100%", md: 400 } }}>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    paddingTop: "56.25%", // 16:9
                    borderRadius: 2,
                    overflow: "hidden"
                  }}
                >
                  <Box
                    component="img"
                    src={imgSrc}
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                </Box>
              </Box>

              {/* COURSE CONTENT */}
              <CardContent sx={{ flex: 1 }} onClick={() =>{
                const slug = slugify(course.name);
                window.open(`/course/${slug}-${course.id}.html`,"blank")
              }}>
                <Stack spacing={2}>
                  <Typography variant="h5" fontWeight="bold">
                    {course.name}
                  </Typography>

                  <Typography color="text.secondary">
                    {course.description}
                  </Typography>

                  <Stack direction="row" spacing={2}>
                    <Chip label={`Chương: ${course.totalSection}`} />
                    <Chip label={`Giá: $${course.price}`} color="primary" />
                  </Stack>

                  <Divider />

                  <Typography variant="subtitle1" fontWeight="bold">
                    Yêu cầu
                  </Typography>

                  <Typography>{course.requirement}</Typography>
                </Stack>
              </CardContent>
            </Stack>
          </Card>
        )}

        {/* RATING */}
        {rating && (
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="h6">User Rating</Typography>

                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                </Stack>

                <Divider />

                <Stack spacing={1}>
                  <Typography fontWeight="bold">
                    {rating.customer?.fullname}
                  </Typography>

                  <Rating value={rating.star} readOnly />

                  <Typography color="text.secondary">
                    {rating.message}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    {new Date(rating.createdAt).toLocaleString()}
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        )}
      </Stack>
    </Container>
  );
}