import { Box, Stack, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import CourseSidebar from "@/components/instructor/course/course.sidebar";
import UpdateDescription from "@/components/instructor/course/update.description";
import UpdateContent from "@/components/instructor/course/content/update.content";
import type { ICourseDetailResponse } from "@/type/course.module";
import { useGetById } from "@/query/use.crud.query";
import { getCourseDetail } from "@/query/course/course.query";


export default function EditCoursePage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<string>("description");
  const [course, setCourse] = useState<ICourseDetailResponse | null>(null);
  const { isLoading, data, refetch } = useGetById<ICourseDetailResponse>(
          "courses/get-by-id",
          getCourseDetail,
          id || ""
        );
  useEffect(() => {
          if (data && !isLoading) setCourse(data);
  }, [data, isLoading]);
  

  const descriptionDone =
    !!course?.description && !!course?.requirement;

  const contentDone =
    (course?.sections?.length ?? 0) > 0;

  return (
    <Box sx={{ minHeight: "100vh", p: 3 }}>
      <Paper
        sx={{
          maxWidth: 1200,
          mx: "auto",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <Stack direction="row">
          {/* ===== LEFT SIDEBAR ===== */}
          <Box sx={{ p: 4, width: 280 }}>
            <CourseSidebar
              descriptionDone={descriptionDone}
              contentDone={contentDone}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </Box>

          {/* ===== MAIN CONTENT ===== */}
          <Box flex={1} px={4} py={3}>
            {activeTab === "description" && (
              <UpdateDescription course={course} refetch={refetch} />
            )}

            {activeTab === "content" && <UpdateContent course={course} refetch={refetch} />}
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
