import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Stack,
  Paper,
  Button,
} from "@mui/material";
import { useState } from "react";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

import { motion, AnimatePresence } from "framer-motion";

import type { ICourseInfoResponse } from "@/type/course.module";
import { minuteToMMSS } from "@/helpers/format.time";

export default function CourseContent({
  course,
}: {
  course: ICourseInfoResponse;
}) {
  const [visibleCount, setVisibleCount] = useState(5);

  const totalLecture = course.sections.reduce(
    (sum, section) => sum + section.totalLecture,
    0
  );

  const visibleSections = course.sections.slice(0, visibleCount);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  const handleCollapse = () => {
    setVisibleCount(5);
  };

  return (
    <Paper
      sx={(theme) => ({
        p: 4,
        mt: 6,
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
      })}
    >
      {/* TITLE */}
      <Typography variant="h5" fontWeight={700} mb={1}>
        Nội dung khóa học
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={3}>
        {course.totalSection} chương • {totalLecture} bài • {course.hour} giờ học
      </Typography>

      {/* SECTIONS */}
      <Stack spacing={0}>
        <AnimatePresence>
          {visibleSections.map((section) => (
            <motion.div
              key={section.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.25,
              }}
            >
              <Accordion
                disableGutters
                sx={(theme) => ({
                  border: `1px solid ${theme.palette.divider}`,
                  "&:not(:last-child)": { borderBottom: 0 },
                  "&:before": { display: "none" },
                })}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    width="100%"
                  >
                    <Typography fontWeight={600}>
                      {section.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {section.totalLecture} bài • {section.hour} giờ
                    </Typography>
                  </Stack>
                </AccordionSummary>

                <AccordionDetails>
                  <Stack spacing={1}>
                    {section.lectures.map((lecture) => (
                      <Stack
                        key={lecture.id}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={(theme) => ({
                          p: 1.2,
                          borderRadius: 1.5,
                          "&:hover": {
                            bgcolor: theme.palette.action.hover,
                          },
                        })}
                      >
                        <Stack direction="row" spacing={1}>
                          <PlayCircleOutlineIcon fontSize="small" />

                          <Typography variant="body2">
                            {lecture.name}
                          </Typography>
                        </Stack>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {minuteToMMSS(lecture.second)}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            </motion.div>
          ))}
        </AnimatePresence>
      </Stack>

      {/* BUTTON */}
      <motion.div
        layout
        transition={{
          duration: 0.25,
        }}
      >
        <Stack alignItems="center" mt={2}>
          {visibleCount < course.sections.length ? (
            <Button variant="outlined" onClick={handleShowMore}>
              Xem thêm
            </Button>
          ) : (
            course.sections.length > 5 && (
              <Button variant="outlined" onClick={handleCollapse}>
                Thu gọn
              </Button>
            )
          )}
        </Stack>
      </motion.div>
    </Paper>
  );
}