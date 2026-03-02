import { minuteToMMSS } from '@/helpers/format.time';
import type { ICourseDetailResponse, ISectionResponse } from '@/type/course.module';
import { Box, Button, IconButton, Stack, TextField, Typography, type Theme } from '@mui/material';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useFormSection } from '@/hooks/instructor/content/form.section.content';
import { useActionContent } from '@/hooks/instructor/content/action.content';
import { useState } from 'react';
import ConfirmDialog from '@/utils/confirm.dialog';

interface IProps{
  theme:Theme;
  collapsed: Record<string,boolean>;
  handleToggleColapse: (value : string) => void;
  course:ICourseDetailResponse|null;
  section:ISectionResponse;
  handleDestroyAll: (publicIds : string[]) => Promise<any>;
}
export default function SectionTitle({course,section,theme,collapsed,handleToggleColapse,
  handleDestroyAll
}: IProps) {
  // edit hook
  const {setEditingSectionId,setEditingSectionTitle,editingSectionId,
        editingSectionTitle,updateSectionTitle
    } = useFormSection(course);
  // delete hook
  const {isDeleteSectionPending,handleDeleteSection}
   = useActionContent(course);

   const [openConfirm, setOpenConfirm] = useState(false);

  return (
    <Stack direction="row" justifyContent="space-between" mb={1}>
              <Box
                sx={{
                  flex: 1,
                  cursor: "text",
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
                onClick={() => {
                  setEditingSectionId(section.id || "");
                  setEditingSectionTitle(section.name || "");
                }}
              >
                {editingSectionId === section.id ? (
                  <Stack direction="row" spacing={1} alignItems="center" 
                    onClick={(e) => e.stopPropagation()}>
                    <TextField
                      size="small"
                      fullWidth
                      autoFocus
                      value={editingSectionTitle}
                      onChange={(e) => setEditingSectionTitle(e.target.value)}
                    />

                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => {
                        updateSectionTitle(section.id || "", editingSectionTitle);
                        setEditingSectionId(null);
                      }}
                    >
                      Lưu
                    </Button>

                    <Button
                      size="small"
                      onClick={() => {
                        setEditingSectionId(null);
                        setEditingSectionTitle("");
                      }}
                    >
                      Huỷ
                    </Button>
                  </Stack>
                ) : (
                  <Box>
                    <Typography fontWeight={700}>{section.name}</Typography>

                    <Typography fontSize={12} color="text.secondary">
                      {section.totalLecture} bài • {minuteToMMSS((section.hour || 0) * 3600)}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Stack direction="row">
                <IconButton
                  color="error"
                  disabled={isDeleteSectionPending}
                  onClick={() => setOpenConfirm(true)}
                >
                  <DeleteOutlineIcon />
                </IconButton>

                <IconButton
                  size="large"
                  sx={{
                    width: 44,
                    height: 44,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleColapse(section.id || "");
                  }}
                >
                  <ExpandMoreIcon
                    sx={{
                      fontSize: 32, // to hơn
                      transform: collapsed[section.id || ""] ? "rotate(-90deg)" : "rotate(0)",
                      transition: "0.2s",
                    }}
                  />
                </IconButton>

              </Stack>
              <ConfirmDialog
                open={openConfirm}
                isLoading={isDeleteSectionPending}
                title="Xoá phần học?"
                description="Toàn bộ bài học bên trong sẽ bị xoá vĩnh viễn. Hành động này không thể hoàn tác."
                onCancel={() => setOpenConfirm(false)}
                onConfirm={async () => {
                  const ids =
                    section?.lectures?.map(l => l.id).filter(Boolean) as string[];

                  if (ids.length > 0) {
                    await handleDestroyAll(ids);
                  }

                  await handleDeleteSection(section.id || "");
                  setOpenConfirm(false);
                }}
              />

            </Stack>
  )
}
