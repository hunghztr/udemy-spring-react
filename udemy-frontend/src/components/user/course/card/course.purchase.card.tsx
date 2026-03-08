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

interface Props {
  courseId: string;
  image?: string;
  price: number;
}

export default function CoursePurchaseCard({ courseId, image, price }: Props) {
  const {handleAdd,isPending} = useCartHook();
  const [loaded, setLoaded] = useState(false);

  const imgSrc = image
    ? image.startsWith("blob:")
      ? image
      : `${import.meta.env.VITE_CLOUDINARY_WATCH_IMG}/${image}`
    : undefined;

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
              color: "#fff",
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

        <Box p={3}>
          {/* PRICE */}
          <Typography fontSize={30} fontWeight={700} mb={3}>
            đ{price.toLocaleString()}
          </Typography>

          {/* BUY BUTTONS */}
          <Stack spacing={2}>
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
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* COURSE INFO */}
          <Stack spacing={1.5}>
            <Typography fontSize={14}>
              ⬇ 5 downloadable resources
            </Typography>

            <Typography fontSize={14}>
              📱 Access on mobile and TV
            </Typography>

            <Typography fontSize={14}>
              ♾ Full lifetime access
            </Typography>

            <Typography fontSize={14}>
              🏆 Certificate of completion
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}