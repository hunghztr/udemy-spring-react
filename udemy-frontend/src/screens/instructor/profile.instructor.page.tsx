import { EditorContent } from "@tiptap/react";
import Joyride, { STATUS, type Step } from "react-joyride";
import { useEffect, useState } from "react";

import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  Stack,
  Paper,
  IconButton,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
} from "@mui/material";

import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useProfileFormHook } from "@/hooks/user/profile.form.hook";


export default function ProfileInstructorPage() {
  const theme = useTheme();
  const {
    editor,
    handleSubmit,
    fullname,
    setFullname,
    preview,
    isUploadingAvatar,
    isUploadingProfile,
    handleSelectAvatar,
    uploadPercent,
    isFocused,
    setIsFocused,
    role,
    setRole, user
  } = useProfileFormHook();

  const [runTour, setRunTour] = useState(false);

  useEffect(() => {
    const done = localStorage.getItem(user?.username || "");
    // Nếu chưa hoàn thành tour, bắt đầu chạy
    if (done !== "visited") {
      setRunTour(true);
    }
  }, []);

  if (!editor) return null;

  const steps: Step[] = [
    {
      target: '[data-tour="role"]',
      content: "Bước 1: Chọn vai trò Giảng viên để bắt đầu tạo khóa học",
      placement: "bottom",
      disableBeacon: true,
    },
    {
      target: '[data-tour="description"]',
      content: "Bước 2: Viết mô tả giới thiệu về bạn và kinh nghiệm giảng dạy",
      placement: "top",
      disableBeacon: true,
    },
    {
      target: '[data-tour="submit"]',
      content: "Bước 3: Lưu thông tin để hoàn tất đăng ký giảng viên",
      placement: "top",
      disableBeacon: true,
    },
  ];

  const handleJoyrideCallback = (data: any) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      localStorage.setItem(user?.username || "", "visited");
      setRunTour(false);
    }
  };

  return (
    <>
      {/* ===== ONBOARDING TOUR ===== */}
      <Joyride
        steps={steps}
        run={runTour}
        continuous
        showSkipButton
        scrollToFirstStep
        callback={handleJoyrideCallback}
        styles={{
          options: {
            zIndex: 1400,
            primaryColor: theme.palette.primary.main,
            textColor: theme.palette.text.primary,
          },
          overlay: {
            backgroundColor: "rgba(0,0,0,0.6)",
          },
          spotlight: {
            borderRadius: 8,
          },
        }}
      />

      {/* ===== PAGE ===== */}
      <Paper sx={{ maxWidth: 800, mx: "auto", p: 4 }}>
        <Typography variant="h5" fontWeight={600} mb={3}>
          Cập nhật hồ sơ giảng viên
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* ===== FULL NAME ===== */}
            <TextField
              label="Họ và tên"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              placeholder="Nguyễn Văn A"
              fullWidth
            />

            {/* ===== ROLE ===== */}
            <FormControl fullWidth data-tour="role">
              <InputLabel id="role-label">
                Bạn muốn làm học viên hay giảng viên?
              </InputLabel>
              <Select
                labelId="role-label"
                label="Bạn muốn làm học viên hay giảng viên?"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <MenuItem value="USER">Học viên</MenuItem>
                <MenuItem value="INSTRUCTOR">Giảng viên</MenuItem>
              </Select>
            </FormControl>

            {/* ===== AVATAR ===== */}
            <Stack spacing={1}>
              <Stack direction="row" spacing={3} alignItems="center">
                <Avatar
                  src={
                    preview
                      ? preview.startsWith("blob:")
                        ? preview //  preview local
                        : `${import.meta.env.VITE_CLOUDINARY_WATCH_IMG}/${preview}`
                      : undefined
                  }
                  sx={{ width: 96, height: 96 }}
                />

                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<PhotoCameraIcon />}
                  disabled={isUploadingAvatar || isUploadingProfile}
                >
                  Chọn ảnh
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={handleSelectAvatar}
                  />
                </Button>
              </Stack>

              {isUploadingAvatar && (
                <Box>
                  <LinearProgress
                    variant="determinate"
                    value={uploadPercent["avatar"]}
                  />
                  <Typography variant="caption">
                    Đang upload: {uploadPercent["avatar"]}%
                  </Typography>
                </Box>
              )}
            </Stack>

            {/* ===== DESCRIPTION ===== */}
            <Box data-tour="description">
              <Typography fontWeight={600} mb={1}>
                Mô tả
              </Typography>

              <Paper
                variant="outlined"
                sx={{
                  borderColor: isFocused ? "primary.main" : "grey.400",
                  transition: "0.2s",
                }}
              >
                {/* TOOLBAR */}
                <Stack
                  direction="row"
                  spacing={1}
                  p={1}
                  borderBottom="1px solid #eee"
                >
                  <IconButton
                    size="small"
                    onClick={() =>
                      editor.chain().focus().toggleBold().run()
                    }
                    color={
                      editor.isActive("bold") ? "primary" : "default"
                    }
                  >
                    <FormatBoldIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    size="small"
                    onClick={() =>
                      editor.chain().focus().toggleItalic().run()
                    }
                    color={
                      editor.isActive("italic") ? "primary" : "default"
                    }
                  >
                    <FormatItalicIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    size="small"
                    onClick={() =>
                      editor.chain().focus().toggleUnderline().run()
                    }
                    color={
                      editor.isActive("underline")
                        ? "primary"
                        : "default"
                    }
                  >
                    <FormatUnderlinedIcon fontSize="small" />
                  </IconButton>
                </Stack>

                {/* EDITOR */}
                <Box
                  sx={{
                    minHeight: 180,
                    p: 2,
                    "& .ProseMirror": {
                      minHeight: 140,
                      outline: "none",
                      cursor: "text",
                      fontSize: "0.95rem",
                      lineHeight: 1.6,
                    },
                  }}
                >
                  <EditorContent
                    editor={editor}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                  />
                </Box>
              </Paper>
            </Box>

            {/* ===== SUBMIT ===== */}
            <Box>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isUploadingAvatar || isUploadingProfile}
                data-tour="submit"
              >
                {isUploadingAvatar || isUploadingProfile
                  ? "Đang xử lý..."
                  : "Lưu thay đổi"}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </>
  );
}