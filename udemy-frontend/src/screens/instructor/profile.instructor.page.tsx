import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
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
} from "@mui/material";

import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { uploadAvatar } from "../../redux/thunks/instructor/file.thunk";
import { updateProfile } from "../../redux/thunks/instructor/profile.thunk";
import { showToast } from "../../utils/toast";

export default function ProfileInstructorPage() {
  const user = useAppSelector((state) => state.currentUser);
  const pendingCount = useAppSelector((state) => state.loading.pendingCount);
  const dispatch = useAppDispatch();
  const uploading = pendingCount > 0;
  const uploadPercent = useAppSelector(state => state.fileProgress.uploadPercent);

  const [fullname, setFullname] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [avatarPath, setAvatarPath] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: `${user?.description || "" }`,
  });

  useEffect(() => {
    if (user?.fullname) setFullname(user.fullname);
    if (user?.avatarPath) setPreview(user.avatarPath);
  }, [user]);

  // ===== Upload avatar ngay khi chọn =====
  const handleSelectAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // preview ngay
    setPreview(URL.createObjectURL(file));

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await dispatch(uploadAvatar({ userId: user.id, formData })).unwrap();
      setAvatarPath(res.result);
    } catch (err) {
      console.error(err);
      alert("Upload ảnh thất bại");
    }
  };

  // ===== Submit profile info =====
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor) return;

    const description = editor.getHTML();

    try {
      await dispatch(updateProfile({
        id: user.id,
        fullname,
        avatarPath: avatarPath || user.avatarPath || "",
        description,
      })).unwrap();
      showToast("Cập nhật hồ sơ thành công");
    } catch (err) {
      console.error(err);
      alert("Update thất bại");
    }
  };

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
              <Avatar src={preview || undefined} sx={{ width: 96, height: 96 }} />

              <Button
                variant="outlined"
                component="label"
                startIcon={<PhotoCameraIcon />}
                disabled={uploading}
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

            {uploading && (
              <Box>
                <LinearProgress variant="determinate" value={uploadPercent} />
                <Typography variant="caption">
                  Đang upload: {uploadPercent}%
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
              disabled={uploading}
            >
              {uploading ? "Đang xử lý..." : "Lưu thay đổi"}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
}
