import { EditorContent } from "@tiptap/react";


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
} from "@mui/material";

import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useProfileFormHook } from "@/hooks/user/profile.form.hook";

export default function ProfileInstructorPage() {
  const {editor,handleSubmit,fullname,setFullname,
    preview,isUploadingAvatar,isUploadingProfile,handleSelectAvatar,uploadPercent,
    isFocused,setIsFocused
  } = useProfileFormHook();
  if (!editor) return null;

  return (
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

          {/* ===== AVATAR ===== */}
          <Stack spacing={1}>
            <Stack direction="row" spacing={3} alignItems="center">
              <Avatar src={`${import.meta.env.VITE_CLOUDINARY_WATCH_IMG}/${preview}` || undefined} sx={{ width: 96, height: 96 }} />

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
                <LinearProgress variant="determinate" value={uploadPercent['avatar']} />
                <Typography variant="caption">
                  Đang upload: {uploadPercent['avatar']}%
                </Typography>
              </Box>
            )}
          </Stack>

          {/* ===== DESCRIPTION ===== */}
          <Box>
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
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  color={editor.isActive("bold") ? "primary" : "default"}
                >
                  <FormatBoldIcon fontSize="small" />
                </IconButton>

                <IconButton
                  size="small"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  color={editor.isActive("italic") ? "primary" : "default"}
                >
                  <FormatItalicIcon fontSize="small" />
                </IconButton>

                <IconButton
                  size="small"
                  onClick={() =>
                    editor.chain().focus().toggleUnderline().run()
                  }
                  color={editor.isActive("underline") ? "primary" : "default"}
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
                  "& .ProseMirror p.is-editor-empty:first-of-type::before": {
                    content: "attr(data-placeholder)",
                    color: "#9ca3af",
                    float: "left",
                    height: 0,
                    pointerEvents: "none",
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
            >
              {isUploadingAvatar || isUploadingProfile ? "Đang xử lý..." : "Lưu thay đổi"}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
}
