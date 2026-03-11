import { Box, Typography, Paper, Avatar } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";

import { useGetAll } from "@/query/use.crud.query";
import type { ICategoryCourseResponse } from "@/type/category.module";
import { getCategoiesChild } from "@/query/category/category.query";
import Loading from "@/components/loading";

export default function PopularCategories() {

  const { data, isPending } = useGetAll<ICategoryCourseResponse[]>(
    "categories/get-children",
    getCategoiesChild
  );

  const colors = [
    "linear-gradient(135deg,#2ec6ff,#2b9fff,#1bd8b6)",
    "linear-gradient(135deg,#ff7a00,#ffb347,#ff5e8a)",
    "linear-gradient(135deg,#6a11cb,#2575fc)",
    "linear-gradient(135deg,#11998e,#38ef7d)",
    "linear-gradient(135deg,#fc466b,#3f5efb)"
  ];

  if (isPending) {
    return <Loading />;
  }

  return (
    <Box
      sx={{
        py: 4,
        px: { xs: 2, md: 8 },
        background: (theme) => theme.palette.background.default,
        overflow: "hidden"
      }}
    >
      <Typography
        variant="h4"
        fontWeight={700}
        textAlign="center"
        mb={8}
        color="primary.main"
      >
        Danh mục phổ biến
      </Typography>

      <Swiper
        effect="coverflow"
        centeredSlides
        spaceBetween={40}
        slidesPerView={3}
        loop
        grabCursor
        autoplay={{ delay: 2500 }}
        modules={[EffectCoverflow, Autoplay]}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 350,
          modifier: 1.5,
          slideShadows: false
        }}
        style={{
          paddingBottom: "80px"
        }}
      >
        {data?.map((item, i) => (
          <SwiperSlide key={item.id}>
            <Paper
              sx={{
                height: 300,
                borderRadius: 6,
                p: 4,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                textAlign: "center",
                background: colors[i % colors.length],
                color: "white",
                backdropFilter: "blur(20px)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)"
              }}
            >
              <Typography fontSize={18} lineHeight={1.6}>
                Khóa học {item.name} giúp bạn nâng cao kỹ năng và làm chủ công
                nghệ hiện đại.
              </Typography>

              <Box display="flex" alignItems="center" gap={2}>
                <Avatar src={`https://i.pravatar.cc/100?img=${i + 1}`} />
                <Typography fontWeight={600}>
                  {item.courseCount}+ khóa học
                </Typography>
              </Box>
            </Paper>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}