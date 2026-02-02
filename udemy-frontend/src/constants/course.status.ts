import type { Theme } from "@mui/material/styles";

export const getCourseStatusMap = (theme: Theme) => ({
  PENDING: {
    label: "Chờ duyệt",
    borderColor: theme.palette.warning.main,
    textColor: theme.palette.warning.dark,
  },
  PUBLISHED: {
    label: "Đã phát hành",
    borderColor: theme.palette.success.main,
    textColor: theme.palette.success.dark,
  },
  REJECTED: {
    label: "Bị từ chối",
    borderColor: theme.palette.error.main,
    textColor: theme.palette.error.dark,
  },
});
