import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Divider,
  IconButton,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useState } from "react";
import { useCartHook } from "@/hooks/user/cart.hook";
import { useNavigate } from "react-router-dom";
import { slugify } from "@/helpers/slugify";
import type { ICourseInfoResponse } from "@/type/course.module";
import { useGetById } from "@/query/use.crud.query";
import { getLearning } from "@/query/learning/learning.query";

interface Props {
  courseId: string;
  image?: string;
  price: number;
  courseName: string;
}

export default function CoursePurchaseCard({
  courseName,
  courseId,
  image,
  price,
}: Props) {
  const { handleAdd, isPending } = useCartHook();
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  const imgSrc = image
    ? image.startsWith("blob:")
      ? image
      : `${import.meta.env.VITE_CLOUDINARY_WATCH_IMG}/${image}`
    : undefined;

  const { data } = useGetById<ICourseInfoResponse>(
    "learnings/learn",
    getLearning,
    courseId || ""
  );

  const slug = slugify(courseName);
  const learnUrl = `/learn/${slug}-${courseId}.html`;
  const isOwned = Boolean(data?.id);

  return (
    <Box
      sx={{
        position: "sticky",
        top: 90,
        width: 360,
      }}
    >
      <Paper
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          border: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
          transition: "all 0.25s ease",
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: "0 24px 50px rgba(0,0,0,0.28)",
          },
        }}
      >
        {/* IMAGE */}
        <Box
          sx={{
            position: "relative",
            height: 200,
            bgcolor: "grey.200",
            overflow: "hidden",
          }}
        >
          {/* BLUR BACKGROUND */}
          {imgSrc && (
            <Box
              component="img"
              src={imgSrc}
              alt="blur preview"
              sx={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "blur(20px)",
                transform: "scale(1.1)",
                opacity: loaded ? 0 : 1,
                transition: "opacity .4s",
              }}
            />
          )}

          {/* REAL IMAGE */}
          <Box
            onClick={() => navigate(learnUrl)}
            sx={{ cursor: "pointer" }}
          >
            <Box
              component="img"
              src={imgSrc}
              alt="course preview"
              onLoad={() => setLoaded(true)}
              sx={{
                position: "relative",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: loaded ? 1 : 0,
                transition: "opacity .4s ease",
              }}
            />

            {/* PLAY BUTTON */}
            <IconButton
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 64,
                height: 64,
                bgcolor: "rgba(0,0,0,0.6)",
                color: "common.white",
                "&:hover": {
                  bgcolor: "rgba(0,0,0,0.8)",
                  transform: "translate(-50%, -50%) scale(1.1)",
                },
                transition: "all 0.2s ease",
              }}
            >
              <PlayArrowIcon sx={{ fontSize: 36 }} />
            </IconButton>
          </Box>
        </Box>

        <Box p={3}>
          {/* PRICE */}
          {!isOwned && (
            <Typography fontSize={30} fontWeight={700} mb={3}>
              đ{price.toLocaleString()}
            </Typography>
          )}

          {/* BUTTONS */}
          <Stack spacing={2}>
            {isOwned ? (
              <Button
                variant="contained"
                size="large"
                fullWidth
                color="success"
                sx={{
                  fontWeight: 700,
                  py: 1.4,
                  fontSize: 15,
                }}
                onClick={() => navigate(learnUrl)}
              >
                Tiếp tục học
              </Button>
            ) : (
              <>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  color="primary"
                  sx={{
                    fontWeight: 700,
                    py: 1.4,
                    fontSize: 15,
                  }}
                  onClick={async () => {
                    await handleAdd(courseId);
                    navigate("/cart");
                  }}
                >
                  Mua ngay
                </Button>

                <Button
                  onClick={() => handleAdd(courseId)}
                  disabled={isPending}
                  variant="outlined"
                  size="large"
                  fullWidth
                  color="primary"
                  sx={{
                    fontWeight: 600,
                    py: 1.3,
                  }}
                >
                  Thêm vào giỏ
                </Button>
              </>
            )}
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* COURSE INFO */}
          <Stack spacing={1.5}>
            <Typography fontSize={14}>
              📱 Học trên điện thoại, máy tính bảng và TV
            </Typography>

            <Typography fontSize={14}>
              ♾ Truy cập trọn đời khóa học
            </Typography>

            <Typography fontSize={14}>
              🏆 Mỗi bài học đều có quizz để thực hành
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}