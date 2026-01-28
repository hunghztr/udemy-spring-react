import {
  Box,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import type { ICourseDetailResponse} from "@/type/course.module";
import { motion, AnimatePresence } from "framer-motion";
import {DndContext,closestCenter} from "@dnd-kit/core";
import {SortableContext,verticalListSortingStrategy} from "@dnd-kit/sortable";
import SectionTitle from "./section.title";
import LectureList from "./lectures.list";
import { useFetchContent } from "@/hooks/instructor/content/fetch.content";
import { useFileDnd } from "@/hooks/instructor/content/file.dnd.content";
import SectionAddForm from "./section.add.form";
import LectureAddForm from "./lecture.add.form";

interface Props {
  course: ICourseDetailResponse | null;
  refetch:() => Promise<any>
}

export default function UpdateContent({ course,refetch }: Props) {
  const theme = useTheme();
  // fetch hook
  const {collapsed,handleToggleColapse,sections,setSections} = useFetchContent(course);

  // upload drag hook
  const {handleDragLectureEnd,isUploadingCloud,setUploadingLectureId,fileInputRef,uploadingLectureId,
        percent,uploadVideo} = useFileDnd(course,refetch,setSections)
        console.log(sections)
  return (
    <Box>
      {/* HEADER */}
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight={700}>
          Nội dung khóa học
        </Typography>
      </Stack>
      {/* SECTIONS */}
      <Stack spacing={3}>
        {sections?.map((section) => (
          <Paper
            key={section.id}
            sx={{
              p: 3,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            {/* SECTION HEADER */}
            <SectionTitle theme={theme}  collapsed={collapsed} 
              handleToggleColapse={handleToggleColapse} course={course} section={section} 
                setSections={setSections} />

            <AnimatePresence initial={false}>
              {!collapsed[section.id || ""] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  style={{ overflow: "hidden" }}
                >
                  
                  <DndContext
                    collisionDetection={closestCenter}
                    onDragEnd={(e) => handleDragLectureEnd(e, section.id || "")}
                  >
                    <SortableContext
                      items={(section.lectures ?? []).map((l) => l.id || "")}
                      strategy={verticalListSortingStrategy}
                    >
                      {/* LECTURES */}
                      <LectureList section={section} theme={theme} 
                            isUploadingCloud={isUploadingCloud} setUploadingLectureId={setUploadingLectureId}
                              fileInputRef={fileInputRef}  uploadingLectureId={uploadingLectureId}
                                  percent={percent} course={course} setSections={setSections}
                       />
                    </SortableContext>
                  </DndContext>


                  {/* ADD LECTURE */}
                  <LectureAddForm course={course} setSections={setSections} section={section} />
                </motion.div>
              )}
            </AnimatePresence>

          </Paper>
        ))}
      </Stack>

      {/* ADD SECTION */}
      <SectionAddForm course={course} setSections={setSections} />
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file && uploadingLectureId) {
              uploadVideo(file, uploadingLectureId);
            }
          }}
        />
    </Box>
  );
}