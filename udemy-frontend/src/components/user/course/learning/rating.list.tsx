import {
  Box,
  Typography,
  Stack,
  Avatar,
  Rating,
  Divider,
  Button,
  Collapse
} from "@mui/material";

import RateReviewIcon from "@mui/icons-material/RateReview";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import FlagIcon from "@mui/icons-material/Flag";

import { useState } from "react";

import { useGetById, useSave } from "@/query/use.crud.query";

import type { IPagination } from "@/type/pagination";
import type { IRatingResponse } from "@/type/learning.module";
import type { INotification } from "@/type/notification.module";

import {
  getCount,
  useGetRatings
} from "@/query/learning/rating.query";

import { fromNow } from "@/helpers/day.time";
import RatingDialog from "./rating.dialog";
import Loading from "@/components/loading";
import { useAppSelector } from "@/redux/hook";
import { showToast } from "@/utils/toast";
import { createNotification } from "@/query/notification/notification.query";

interface Props {
  courseId: string;
  isRate?: boolean;
}

export default function RatingList({ courseId, isRate = true }: Props) {

  const user = useAppSelector((state) => state.currentUser);

  const isInstructor = user?.roleName === "INSTRUCTOR";

  const { mutate: sendNotify, isPending } =
    useSave<boolean, INotification>(
      "notifications/create",
      createNotification
    );

  const [pagination] = useState<IPagination>({
    page: 0,
    size: 5
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useGetRatings({ courseId, pagination });

  const { data: count } = useGetById<number>(
    "ratings/get-count",
    getCount,
    courseId
  );

  if (isLoading) {
    return <Loading />;
  }

  const ratings: IRatingResponse[] =
    data?.pages.flatMap((p) => p.items) ?? [];

  const handleReport = (rating: IRatingResponse) => {
    const notification: INotification = {
      title: "Báo cáo đánh giá",
      message: `Giảng viên ${user.fullname} đã báo cáo đánh giá của ${rating.customer.fullname}`,
      url: `/admin/ratings/${courseId}?watchReport=${rating.customer.id}`,
      user:{
        username:"admin@gmail.com"
      }
    };

    sendNotify(notification, {
      onSuccess: () => {
        showToast("Đã báo cáo đánh giá", "success");
      },
      onError: (err: any) => {
        showToast(
          err?.response?.data?.message || "Có lỗi xảy ra",
          "error"
        );
      }
    });
  };

  return (
    <Box mt={4}>

      {/* Header */}

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" fontWeight={700}>
          Đánh giá ({count ?? 0})
        </Typography>

        {isRate && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<RateReviewIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Viết đánh giá
          </Button>
        )}
      </Stack>

      {/* Toggle */}

      <Button
        size="small"
        onClick={() => setExpanded(!expanded)}
        endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        sx={{ mb: 2 }}
      >
        {expanded ? "Thu gọn đánh giá" : "Xem đánh giá"}
      </Button>

      {/* Rating list */}

      <Collapse in={expanded} timeout="auto" unmountOnExit>

        <Stack spacing={3}>

          {ratings.map((rating) => (

            <Box
              key={`${rating.id.userId}-${rating.id.courseId}`}
            >

              <Stack direction="row" spacing={2}>

                <Avatar>
                  {rating.customer.fullname?.charAt(0)}
                </Avatar>

                <Box flex={1}>

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography fontWeight={600}>
                      {rating.customer.fullname}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {fromNow(rating.createdAt)}
                    </Typography>
                  </Stack>

                  <Rating
                    value={rating.star}
                    precision={0.5}
                    readOnly
                    size="small"
                  />

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    mt={1}
                  >
                    {rating.message}
                  </Typography>

                  {/* Instructor report */}

                  {isInstructor &&
                    rating.id.userId !== user?.id && (

                      <Box mt={1}>

                        <Button
                          size="small"
                          color="error"
                          startIcon={<FlagIcon />}
                          onClick={() => handleReport(rating)}
                          disabled={isPending}
                        >
                          Báo cáo
                        </Button>

                      </Box>

                    )}

                </Box>

              </Stack>

              <Divider sx={{ mt: 2 }} />

            </Box>

          ))}

          {hasNextPage && (

            <Box textAlign="center" mt={2}>

              <Button
                variant="outlined"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage
                  ? "Đang tải..."
                  : "Xem thêm"}
              </Button>

            </Box>

          )}

        </Stack>

      </Collapse>

      {/* Rating dialog */}

      <RatingDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        courseId={courseId}
      />

    </Box>
  );
}