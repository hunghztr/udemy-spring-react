import { minuteToMMSS } from '@/helpers/helper';
import type { ICourseDetailResponse, ISectionResponse } from '@/type/course.module';
import { Box, Button, IconButton, Stack, TextField, Typography, type Theme } from '@mui/material';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useFormSection } from '@/hooks/instructor/content/form.section.content';
import { useActionContent } from '@/hooks/instructor/content/action.content';

interface IProps{
  theme:Theme;
  collapsed: Record<string,boolean>;
  handleToggleColapse: (value : string) => void;
  course:ICourseDetailResponse|null;
  setSections:React.Dispatch<React.SetStateAction<ISectionResponse[]>>,section:ISectionResponse

}
export default function SectionTitle({course,setSections,section,theme,collapsed,handleToggleColapse
}: IProps) {
  // edit hook
  const {setEditingSectionId,setEditingSectionTitle,editingSectionId,
        editingSectionTitle,updateSectionTitle
    } = useFormSection(course,setSections);
  // delete hook
  const {isDeleteSectionPending,handleDeleteSection}
   = useActionContent(course,setSections);
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
                  onClick={() => {
                    if (window.confirm("Xoá phần học này và toàn bộ bài học bên trong?")) {
                      handleDeleteSection(section.id || "");
                    }
                  }}
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
            </Stack>
  )
}
