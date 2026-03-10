import { Box, Grid } from "@mui/material";

import { useParams } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";

import { useGetById } from "@/query/use.crud.query";
import { getLearning } from "@/query/learning/learning.query";

import type { ICourseInfoResponse, ILectureResponse } from "@/type/course.module";
import VideoPlayer from "@/components/user/course/learning/video.player";
import CourseContent from "@/components/user/course/learning/course.content";
import CourseInfo from "@/components/user/course/learning/course.info";


export default function DetailLearningPage() {

  const { slug } = useParams();

  const courseId = useMemo(() => {
    if (!slug) return null;
    const match = slug.match(/([0-9a-fA-F-]{36})\.html$/);
    return match ? match[1] : null;
  }, [slug]);

  const { data, isPending } = useGetById<ICourseInfoResponse>(
    "learnings/learn",
    getLearning,
    courseId || ""
  );

  const [currentLecture, setCurrentLecture] =
    useState<ILectureResponse | null>(null);

  useEffect(() => {
    if (!data?.sections?.length) return;

    // tìm lecture chưa hoàn thành đầu tiên
    let nextLecture: ILectureResponse | null = null;

    for (const section of data.sections) {
      const found = section.lectures.find(l => !l.isFinished);
      if (found) {
        nextLecture = found;
        break;
      }
    }

    // nếu tất cả đã hoàn thành → fallback lecture đầu tiên
    if (!nextLecture) {
      nextLecture = data.sections[0]?.lectures?.[0] ?? null;
    }

    setCurrentLecture(nextLecture);

  }, [data]);

  if (isPending || !data) return null;
  return (

    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        px: 3,
        py: 2
      }}
    >

      <Grid container spacing={2}>

        <Grid size={{ xs: 12, md: 8 }}>
          <VideoPlayer lecture={currentLecture}/>
          <CourseInfo course={data} />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <CourseContent
          courseId={data.id}
          sections={data.sections}
          currentLecture={currentLecture||undefined}
          setCurrentLecture={setCurrentLecture}
        />
        </Grid>

      </Grid>

    </Box>

  );
}