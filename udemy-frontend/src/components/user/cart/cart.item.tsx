import { slugify } from "@/helpers/slugify";
import type { ICartCourseResponse } from "@/type/cart.module";
import {
  Box,
  Typography,
  Stack,
  Button,
  Divider,
  TextField,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface Props {
  course: ICartCourseResponse;
  handleDelete: (id: string) => void;
  handleApply : (courseId : string, code : string) => void;
}

export default function CartItem({ course, handleDelete ,handleApply}: Props) {
  const [showCoupon, setShowCoupon] = useState(false);
  const [coupon, setCoupon] = useState("");

  const imgSrc = course.imagePath
    ? course.imagePath.startsWith("blob:")
      ? course.imagePath
      : `${import.meta.env.VITE_CLOUDINARY_WATCH_IMG}/${course.imagePath}`
    : undefined;

  const handleClick = () => {
    const slug = slugify(course.name);
    window.open(`/course/${slug}-${course.id}.html`, "_blank");
  };

  const handleApplyCoupon = () => {
    handleApply(course.id,coupon);
    setShowCoupon(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, x: -40, height: 0 }}
      transition={{ duration: 0.3 }}
      style={{ overflow: "hidden" }}
    >
      <Box
        py={3}
        onClick={handleClick}
        sx={{
          cursor: "pointer",
          borderRadius: 2,
          px: 2,
          transition: "all 0.25s",

          "&:hover": {
            backgroundColor: "rgba(0,0,0,0.03)",
          },

          "&:hover .course-img": {
            filter: "blur(0px) brightness(1)",
            transform: "scale(1.08)",
          },
        }}
      >
        {/* MAIN ROW */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "120px 1fr 180px",
            columnGap: 2,
            alignItems: "center",
          }}
        >
          {/* IMAGE */}
          <Box
            sx={{
              width: 120,
              height: 70,
              borderRadius: 1,
              overflow: "hidden",
              position: "relative",
              flexShrink: 0,
            }}
          >
            <Box
              component="img"
              src={imgSrc}
              alt={course.name}
              className="course-img"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "blur(1.5px) brightness(0.9)",
                transition: "all 0.3s ease",
              }}
            />

            <PlayArrowIcon
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: 36,
                color: "common.white",
                opacity: 0.95,
                pointerEvents: "none",
              }}
            />
          </Box>

          {/* TITLE */}
          <Box sx={{ minWidth: 0 }}>
            <Typography
              fontWeight={600}
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {course.name}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              ⭐ {course.star} • {course.hour} Giờ
            </Typography>
          </Box>

          {/* PRICE + ACTION */}
          <Stack spacing={1} alignItems="flex-end">
            <Stack spacing={0.5} alignItems="flex-end">

            {course.priceTemp && (
                <Typography
                sx={{
                    textDecoration: "line-through",
                    fontSize: 13,
                    color: "text.secondary"
                }}
                >
                ₫{course.priceTemp.toLocaleString()}
                </Typography>
            )}

            <Typography fontWeight={700} color="secondary">
                ₫{course.price.toLocaleString()}
            </Typography>

            </Stack>

            <Button
              size="small"
              variant="outlined"
              onClick={(e) => {
                e.stopPropagation();
                setShowCoupon((prev) => !prev);
              }}
            >
              Nhập code
            </Button>

            <Button
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(course.id);
              }}
            >
              Xoá Khoá
            </Button>
          </Stack>
        </Box>

        {/* COUPON DROPDOWN */}
        <AnimatePresence>
          {showCoupon && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Box
                mt={2}
                onClick={(e) => e.stopPropagation()}
                sx={{
                  backgroundColor: "grey.50",
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={500}
                  mb={1}
                  color="text.secondary"
                >
                  Nhập mã giảm giá cho khoá học này
                </Typography>

                <Stack direction="row" spacing={1}>
                  <TextField
                    size="small"
                    placeholder="VD: SAVE10"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    sx={{ width: 220 }}
                  />

                  <Button variant="contained" onClick={handleApplyCoupon}>
                    Áp dụng
                  </Button>

                  <Button
                    color="inherit"
                    onClick={() => {
                      setCoupon("");
                      setShowCoupon(false);
                    }}
                  >
                    Huỷ
                  </Button>
                </Stack>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        <Divider sx={{ mt: 3 }} />
      </Box>
    </motion.div>
  );
}