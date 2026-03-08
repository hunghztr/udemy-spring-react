import {
  Box,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { useGetPaging } from "@/query/use.crud.query";
import { searchFuzzi } from "@/query/course/search.query";
import { type IFilterRequest, type ICourseSearchResponse } from "@/type/course.module";
import type { IMetaResponse, IPagination } from "@/type/pagination";
import SearchCourseCard from "@/components/user/course/card/search.course.card";
import FilterDrawer from "@/components/user/course/filter.drawer";
import SkeletonCard from "@/components/user/course/card/skeleton.card";
import { motion, AnimatePresence } from "framer-motion";
import { gridItemVariants } from "@/helpers/variants";
import { useState } from "react";
import PaginationComponent from "@/components/admin/layout/pagination.component";
import CourseSort from "@/components/user/course/course.sort";

export default function SearchPage() {
  const [params] = useSearchParams();

  const keyword = params.get("keyword") || "";
  const [page, setPage] = useState<number>(1);
  const [filters, setFilters] = useState<IFilterRequest|undefined>(undefined);
  const {data,isLoading} = useGetPaging<ICourseSearchResponse, 
  {data: IPagination; filters: IFilterRequest|undefined}
  >(
    "courses/search",
    searchFuzzi,
    { data: { page:page-1, size: 6, keyword }, filters }
  );
  const meta = data?.meta;
  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
      {/* ===== TITLE ===== */}
      <Typography variant="h5" fontWeight={700} mb={3}>
        {keyword
          ? `Kết quả tìm kiếm cho "${keyword}"`
          : "Tất cả khoá học"}
      </Typography>
      <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{ mb: 2 }}
        >
          <FilterDrawer filters={filters} setFilters={setFilters} />
          <CourseSort
            onChange={(value) => {
              setPage(1);

              setFilters((prev) => ({
                ...prev,
                sortBy: value as IFilterRequest["sortBy"],
              }));
            }}
          />
        </Stack>
      {/* ===== COURSE GRID ===== */}
      <Grid container spacing={3}>
        <AnimatePresence mode="wait">
            {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <Grid size={{ xs: 12, md: 4 }} key={`skeleton-${index}`}>
                    <motion.div
                    variants={gridItemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    >
                    <SkeletonCard />
                    </motion.div>
                </Grid>
                ))
            : data?.elements?.map((course, index) => (
                <Grid size={{ xs: 12, md: 4 }} key={course.id}>
                    <motion.div
                    variants={gridItemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{
                        duration: 0.4,
                        ease: "easeOut",
                        delay: index * 0.06,
                    }}
                    >
                    <SearchCourseCard course={course} />
                    </motion.div>
                </Grid>
                ))}
        </AnimatePresence>
        </Grid>

      {!isLoading && (
                <PaginationComponent
                  meta={meta||{} as IMetaResponse}
                  page={page}
                  setPage={setPage}
                  isLoading={isLoading}
                />
              )}
    </Box>
  );
}
