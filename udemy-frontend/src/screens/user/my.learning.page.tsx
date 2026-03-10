import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Grid,
  Stack
} from "@mui/material";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ILearningResponse } from "@/type/course.module";
import LearningCard from "@/components/user/course/card/learning.card";
import { useGetAll } from "@/query/use.crud.query";
import { getAllLearnings } from "@/query/learning/learning.query";
import { container, item } from "@/helpers/variants";
import SkeletonLearningCard from "@/components/user/course/card/skeleton.learing.card";

export default function MyLearningPage() {

  const [filter,setFilter] =
  useState<"in-progress"|"completed"|"all">("all");

  const { data: courses, isPending } =
  useGetAll<ILearningResponse[]>(
    `learnings/get-all-${filter}`,
    () => getAllLearnings(filter)
  );

  const [tab, setTab] = useState(0);

  const handleChange = (_: any, value: number) => {

    setTab(value);

    if (value === 0) setFilter("all");
    if (value === 1) setFilter("in-progress");
    if (value === 2) setFilter("completed");

  };

  

  return (
    <Box sx={{minHeight:"600px"}}>

      {/* HERO */}
      <Box
        sx={(theme) => ({
          background: theme.palette.hero.background,
          color: theme.palette.hero.text,
          pt: 6,
          pb: 0,
          borderBottom: `1px solid ${theme.palette.hero.chipBg}`
        })}
      >
        <Container maxWidth="lg">

          <Stack spacing={3}>

            <Typography
              variant="h3"
              fontWeight={700}
            >
              Học tập của tôi
            </Typography>

            <Tabs
              value={tab}
              onChange={handleChange}
              sx={(theme) => ({
                "& .MuiTabs-indicator": {
                  backgroundColor: theme.palette.primary.main,
                  height: 3
                },

                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: 15,
                  color: "rgba(255,255,255,0.7)",
                  minHeight: 42,
                  px: 2
                },

                "& .Mui-selected": {
                  color: theme.palette.hero.text
                }
              })}
            >
              <Tab label="Tất cả" />
              <Tab label="Đang học" />
              <Tab label="Hoàn thành" />
            </Tabs>

          </Stack>

        </Container>
      </Box>

      {/* COURSE GRID */}
      <Container
        maxWidth="lg"
        sx={{
          py: 5
        }}
      >

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          key={filter}
        >

          <Grid container spacing={3}>

            <AnimatePresence mode="wait">
                {isPending &&
                Array.from({ length: 8 }).map((_,i)=>(
                <Grid key={i} sx={{ xs:12, sm:6, md:4, lg:3 }}>
                    <SkeletonLearningCard/>
                </Grid>
                ))}
              {courses?.map(course => (

                <Grid
                  key={course.id}
                  sx={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                >

                  <motion.div
                    variants={item}
                    layout
                    initial="hidden"
                    animate="show"
                    exit={{ opacity: 0, scale: 0.95 }}
                  >

                    <LearningCard course={course} />

                  </motion.div>

                </Grid>

              ))}

            </AnimatePresence>

          </Grid>

        </motion.div>

        {courses?.length === 0 && (
          <Typography
            textAlign="center"
            color="text.secondary"
            sx={{ mt: 6 }}
          >
            Bạn chưa có khóa học nào
          </Typography>
        )}

      </Container>

    </Box>
  );
}