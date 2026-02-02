import { Box, Stack, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import CourseSidebar from "@/components/instructor/course/course.sidebar";
import UpdateDescription from "@/components/instructor/course/update.description";
import UpdateContent from "@/components/instructor/course/content/update.content";

import type { ICourseDetailResponse } from "@/type/course.module";
import { useGetById } from "@/query/use.crud.query";
import { getCourseDetail } from "@/query/course/course.query";
import UpdateImage from "@/components/instructor/course/update.image";
import UpdatePricing from "@/components/instructor/course/pricing/update.pricing";

type CourseTab = "description" | "image" | "content" | "pricing";

export default function EditCoursePage() {
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState<CourseTab>("description");
  const [course, setCourse] = useState<ICourseDetailResponse | null>(null);
  
  const { isLoading, data, refetch } = useGetById<ICourseDetailResponse>(
    "courses/get-by-id",
    getCourseDetail,
    id || ""
  );

  useEffect(() => {
    if (data && !isLoading) {
      setCourse(data);
    }
  }, [data, isLoading]);


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
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              course={course}
              refetch={refetch}
            />
          </Box>

          {/* ===== MAIN CONTENT ===== */}
          <Box flex={1} px={4} py={3} position="relative" overflow="hidden">
          
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {activeTab === "description" && (
                  <UpdateDescription course={course} refetch={refetch} />
                )}

                {activeTab === "image" && (
                  <UpdateImage course={course} refetch={refetch} />
                )}

                {activeTab === "content" && (
                  <UpdateContent course={course} refetch={refetch} />
                )}
                {activeTab === "pricing" && (
                  <UpdatePricing course={course} refetch={refetch}  />
                )}
              </motion.div>
            </AnimatePresence>
          </Box>

        </Stack>
      </Paper>
    </Box>
  );
}
