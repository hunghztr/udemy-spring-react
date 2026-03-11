import { useParams } from "react-router-dom";
import { useMemo } from "react";
import {
  Box,
  Typography,
  Container,
  Stack,
  Chip,
  Grid,
} from "@mui/material";

import { useGetById } from "@/query/use.crud.query";
import type { ICourseInfoResponse } from "@/type/course.module";
import { getCourseInfo } from "@/query/course/course.query";

import Loading from "@/components/loading";

import { formatToVNTime } from "@/helpers/format.time";
import CoursePurchaseCard from "@/components/user/course/card/course.purchase.card";
import WhatLearn from "@/components/user/course/detail/what.learn";
import Requirement from "@/components/user/course/detail/requirement";
import Content from "@/components/user/course/detail/content";
import Instructor from "@/components/user/course/detail/instructor";
import RatingList from "@/components/user/course/learning/rating.list";

const splitToList = (value?: string) =>
  value
    ? value.split(",").map((i) => i.trim()).filter(Boolean)
    : [];

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const courseId = useMemo(() => {
    if (!slug) return null;
    const match = slug.match(/([0-9a-fA-F-]{36})\.html$/);
    return match ? match[1] : null;
  }, [slug]);

  const { data, isLoading } = useGetById<ICourseInfoResponse>(
    "/get-course-detail",
    getCourseInfo,
    courseId || ""
  );

  if (isLoading) {
    return <Loading />;
  }

  if (!data) return null;

  const objectives = splitToList(data.description);
  const requirements = splitToList(data.requirement);
  
  return (
    <>
      {/* ================= PHẦN HERO ================= */}
      <Box
        sx={(theme) => ({
          bgcolor: theme.palette.hero.background,
          color: theme.palette.hero.text,
          py: 8
        })}
      >
        <Container maxWidth="lg">
          <Stack spacing={2} maxWidth={720}>
            {/* Danh mục */}
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {data.categories.map((cat) => (
                <Chip
                  key={cat.id}
                  label={cat.name}
                  size="small"
                  sx={(theme)=>({
                    bgcolor: theme.palette.hero.chipBg,
                    color: theme.palette.hero.text
                  })}
                />
              ))}
            </Stack>

            {/* Tên khóa học */}
            <Typography variant="h4" fontWeight={700}>
              {data.name}
            </Typography>

            {/* Đánh giá */}
            <Typography>
              ⭐ {data.star} • {data.sold} học viên
            </Typography>

            {/* Tác giả */}
            <Typography>
              Tạo bởi <b>{data.author.fullname}</b>
            </Typography>

            {/* Ngày cập nhật */}
            <Typography sx={{ opacity: 0.8, fontSize: 14 }}>
              Cập nhật lần cuối {formatToVNTime(data.updatedAt)}
            </Typography>
          </Stack>
        </Container>
      </Box>

      {/* ================= NỘI DUNG ================= */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>

      {/* NỘI DUNG BÊN TRÁI */}
      <Grid sx={{ xs: "12", md: "8", minWidth: 740, maxWidth: 740 }}>
        <Box>
          <WhatLearn objectives={objectives} />
          <Requirement items={requirements} />
          <Content course={data} />
          <Instructor author={data.author} />
        </Box>
      </Grid>

      {/* THẺ MUA KHÓA HỌC */}
      <Grid
        sx={{
          xs: "12",
          md: "4",
          mt: { md: -32 }
        }}
      >
        <CoursePurchaseCard
          courseName={data.name}
          courseId={data.id}
          price={data.price}
          image={data.imagePath}
        />
      </Grid>
      


    </Grid>
    <Box sx={{width:"50%"}}>
        <RatingList courseId={data.id} isRate={false}  />
    </Box>
    
      </Container>
    </>
  );
}