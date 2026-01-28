import { minuteToMMSS } from '@/helpers/helper';
import type { ICourseDetailResponse, ISectionResponse } from '@/type/course.module';
import SortableLectureItem from '@/utils/sort.table.lecture';
import { Box, Button, IconButton, LinearProgress, Stack, TextField, Typography, type Theme } from '@mui/material';
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useActionContent } from '@/hooks/instructor/content/action.content';
import { useFormLecture } from '@/hooks/instructor/content/form.lecture.content';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from 'react';

interface IProps{
    section:ISectionResponse;
    theme:Theme;
    isUploadingCloud: boolean;
    setUploadingLectureId:(value : string) => void;
    fileInputRef:React.RefObject<HTMLInputElement | null>;
    uploadingLectureId:string|null;
    percent: Record<string, number>;
    course:ICourseDetailResponse|null;
    setSections:React.Dispatch<React.SetStateAction<ISectionResponse[]>>
}
export default function LectureList({course,setSections,section,theme,isUploadingCloud,
fileInputRef,setUploadingLectureId,
uploadingLectureId,percent

}:IProps) {
  // delete hook
  const {isDeleteLecturePending,handleDeleteLecture}
   = useActionContent(course,setSections);
   // edit hook
   const {editingLectureId,editingLectureTitle,setEditingLectureTitle,updateLectureTitle,
        setEditingLectureId
    } = useFormLecture(course,setSections);

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [previewTitle, setPreviewTitle] = useState<string>("");

    const openPreview = (url: string, title: string) => {
      setPreviewUrl(`${import.meta.env.VITE_CLOUDINARY_WATCH_VIDEO}/${url}.m3u8`);
      setPreviewTitle(title);
    };

    const closePreview = () => {
      setPreviewUrl(null);
      setPreviewTitle("");
    };

  return (
    <Stack spacing={1.5} mt={1}>
                  {section?.lectures?.map((l, i) => (
                    <SortableLectureItem id={l.id || ""} key={l.id}>
                      {(listeners) => (
                        <Box
                          sx={{
                            border: `1px dashed ${theme.palette.primary.main}`,
                            borderRadius: 1,
                            px: 2,
                            py: 1.5,
                            display: "flex",
                            flexDirection: "column",
                            gap: 1.5,
                          }}
                        >
                          {/* ROW */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: 2,
                            }}
                          >
                            {/* LEFT: drag + title */}
                            <Stack direction="row" spacing={1} alignItems="center" flex={1}>
                              
                              {/* ✅ DRAG HANDLE */}
                              <IconButton
                                {...listeners}
                                size="small"
                                sx={{ cursor: "grab" }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                ☰
                              </IconButton>

                              {/* TITLE */}
                              <Box sx={{ flex: 1 }}>
                                {editingLectureId === l.id ? (
                                  <Stack direction="row" spacing={1} alignItems="center">
                                    <TextField
                                      size="small"
                                      fullWidth
                                      autoFocus
                                      value={editingLectureTitle}
                                      onChange={(e) => setEditingLectureTitle(e.target.value)}
                                      onClick={(e) => e.stopPropagation()}
                                    />

                                    <Button
                                      size="small"
                                      variant="contained"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateLectureTitle(
                                          l.id || "",
                                          editingLectureTitle,
                                          section.id || ""
                                        );
                                        setEditingLectureId(null);
                                      }}
                                    >
                                      Lưu
                                    </Button>

                                    <Button
                                      size="small"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingLectureId(null);
                                        setEditingLectureTitle("");
                                      }}
                                    >
                                      Huỷ
                                    </Button>
                                  </Stack>
                                ) : (
                                  <Typography
                                    fontSize={14}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingLectureId(l.id || "");
                                      setEditingLectureTitle(l.name || "");
                                    }}

                                    sx={{ "&:hover": { textDecoration: "underline" } }}
                                  >
                                    Bài {i + 1}: {l.name}
                                  </Typography>
                                )}

                                {l.second > 0 && (
                                  <Typography fontSize={12} color="text.secondary">
                                    ⏱ {minuteToMMSS(l.second)}
                                  </Typography>
                                )}
                                
                              </Box>
                            </Stack>

                            {/* RIGHT ACTIONS */}
                            <Stack direction="row" spacing={1}>
                              {l.path && (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openPreview(l.path!, l.name || "");
                                  }}
                                >
                                  Xem
                                </Button>
                              )}
                              <Button
                                size="small"
                                variant="outlined"
                                disabled={isUploadingCloud}
                                onClick={() => {
                                  setUploadingLectureId(l.id || "");
                                  fileInputRef.current?.click();
                                }}
                              >
                                {l.path ? "Ghi đè video" : "Thêm video"}
                              </Button>

                              <IconButton
                                size="small"
                                color="error"
                                disabled={isDeleteLecturePending}
                                onClick={() => {
                                  if (window.confirm("Xoá bài học này?")) {
                                    handleDeleteLecture(l.id || "");
                                  }
                                }}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                          </Box>

                          {/* PROGRESS */}
                          {uploadingLectureId === l.id && (
                            <Box>
                              <LinearProgress
                                variant="determinate"
                                value={percent[l.id || ""] || 0}
                              />
                              <Typography fontSize={12} mt={0.5}>
                                Đang upload: {percent[l.id || ""] || 0}%
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      )}
                    </SortableLectureItem>

                          ))}
                          {/* ===== PREVIEW VIDEO POPUP ===== */}
                            <Dialog
                              open={!!previewUrl}
                              onClose={closePreview}
                              maxWidth="md"
                              fullWidth
                            >
                              <DialogTitle sx={{ pr: 6 }}>
                                {previewTitle}
                                <IconButton
                                  onClick={closePreview}
                                  sx={{ position: "absolute", right: 8, top: 8 }}
                                >
                                  <CloseIcon />
                                </IconButton>
                              </DialogTitle>

                              <DialogContent>
                                {previewUrl && (
                                  <Box
                                    component="video"
                                    src={previewUrl}
                                    controls
                                    autoPlay
                                    sx={{
                                      width: "100%",
                                      borderRadius: 2,
                                      background: "#000",
                                    }}
                                  />
                                )}
                              </DialogContent>
                            </Dialog>

                </Stack>
  )
}
