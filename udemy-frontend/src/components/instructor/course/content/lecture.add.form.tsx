import { useFormLecture } from "@/hooks/instructor/content/form.lecture.content";
import type { ICourseDetailResponse, ISectionResponse } from "@/type/course.module";
import AddIcon from "@mui/icons-material/Add";
import { Button, Stack, TextField } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
export default function LectureAddForm({course,setSections,section}:{
    course:ICourseDetailResponse|null;
      setSections:React.Dispatch<React.SetStateAction<ISectionResponse[]>>,section:ISectionResponse
}) {
    const {setAddingLectureSectionId,setNewLectureTitle,addingLectureSectionId,
        newLectureTitle,isCreateLecturePending,handleAddLecture,
    } = useFormLecture(course,setSections);
  return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
    >
            <Button
                startIcon={<AddIcon />}
                      sx={{ mt: 2 }}
                      onClick={() => {
                        setAddingLectureSectionId(section.id || "");
                        setNewLectureTitle("");
                      }}
                    >
                      Thêm bài học
                    </Button>
                      <AnimatePresence>
                        {addingLectureSectionId === section.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            style={{ overflow: "hidden" }}
                          >
                            <Stack direction="row" spacing={1.5} mt={2} alignItems="center">
                              <TextField
                                size="small"
                                fullWidth
                                placeholder="Tên bài học..."
                                value={newLectureTitle}
                                onChange={(e) => setNewLectureTitle(e.target.value)}
                                autoFocus
                              />

                              <Button
                                variant="contained"
                                size="small"
                                disabled={isCreateLecturePending}
                                onClick={() => handleAddLecture()}
                              >
                                Lưu
                              </Button>

                              <Button
                                size="small"
                                variant="text"
                                onClick={() => {
                                  setAddingLectureSectionId(null);
                                  setNewLectureTitle("");
                                }}
                              >
                                Huỷ
                              </Button>
                            </Stack>
                          </motion.div>
                        )}
            </AnimatePresence>

        </motion.div>
  )
}
