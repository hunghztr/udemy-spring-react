import { createRating } from "@/query/learning/rating.query";
import { query } from "@/query/queryClient";
import { useSave } from "@/query/use.crud.query";
import type { IRating, IRatingResponse } from "@/type/learning.module";
import { showToast } from "@/utils/toast";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Rating,
  TextField,
  Stack,
  Typography,
  Box
} from "@mui/material";

import { motion } from "framer-motion";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  courseId: string;
}

const MotionBox = motion(Box);
const MotionStack = motion(Stack);
const MotionButton = motion(Button);

export default function RatingDialog({ open, onClose, courseId }: Props) {
  const [star, setStar] = useState<number>(5);
  const [message, setMessage] = useState("");

  const { mutate, isPending } = useSave<
    IRatingResponse,
    { courseId: string; rating: IRating }
  >("ratings/create", createRating);

  const handleSubmit = () => {
    const payload = {
      star,
      message
    };

    mutate(
      {
        courseId,
        rating: payload
      },
      {
        onSuccess: (data) => {
          query.setQueriesData(
            { queryKey: ["ratings/get-all-by-course", courseId] },
            (old: any) => {
              if (!old) return old;

              return {
                ...old,
                pages: old.pages.map((page: any, index: number) => {
                  if (index === 0) {
                    return {
                      ...page,
                      items: [data, ...page.items]
                    };
                  }
                  return page;
                })
              };
            }
          );
        },
        onError: (err) => {
          showToast(err.response?.data.message || "", "error");
        }
      }
    );

    setMessage("");
    setStar(5);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>

      <MotionBox
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >

        <DialogTitle
          sx={{
            fontWeight: 700,
            textAlign: "center"
          }}
        >
          ⭐ Đánh giá khoá học
        </DialogTitle>

        <DialogContent>

          <MotionStack
            spacing={3}
            mt={1}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.15
                }
              }
            }}
          >

            {/* Rating */}
            <MotionStack
              alignItems="center"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >

              <Typography mb={1} fontWeight={600}>
                Đánh giá của bạn
              </Typography>

              <MotionBox
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Rating
                  value={star}
                  precision={0.5}
                  size="large"
                  onChange={(_, value) => setStar(value || 5)}
                />
              </MotionBox>

            </MotionStack>

            {/* TextField */}
            <MotionBox
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              whileFocus={{ scale: 1.02 }}
            >
              <TextField
                label="Your review"
                multiline
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your experience with this course..."
                fullWidth
              />
            </MotionBox>

          </MotionStack>

        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 2,
            justifyContent: "space-between"
          }}
        >

          <MotionButton
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Huỷ
          </MotionButton>

          <MotionButton
            variant="contained"
            onClick={handleSubmit}
            disabled={isPending}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            sx={{
              borderRadius: "10px",
              fontWeight: 600,
              px: 3
            }}
          >
            {isPending ? "Đang gửi..." : "Xác nhận"}
          </MotionButton>

        </DialogActions>

      </MotionBox>

    </Dialog>
  );
}