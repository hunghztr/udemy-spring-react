import {
  Box,
  Grid,
  Typography,
  Pagination,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { useGetPaging } from "@/query/use.crud.query";
import { searchFuzzi } from "@/query/course/search.query";
import type { ICourseSearchResponse } from "@/type/course.module";
import type { IPagination } from "@/type/pagination";
import SearchCourseCard from "@/components/user/course/card/search.course.card";
import FilterDrawer from "@/components/user/course/filter.drawer";
import SkeletonCard from "@/components/user/course/card/skeleton.card";
import { motion, AnimatePresence } from "framer-motion";
import { gridItemVariants } from "@/helpers/variants";

export default function SearchPage() {
  const [params, setParams] = useSearchParams();

  const keyword = params.get("keyword") || "";
  const page = 0;

  const {data,isLoading} = useGetPaging<ICourseSearchResponse, IPagination>(
    "courses/search",
    searchFuzzi,
    { page, size: 10, keyword }
  );

  const handleChangePage = (_: any, value: number) => {
    params.set("page", String(value - 1));
    setParams(params);
  };

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
      {/* ===== TITLE ===== */}
      <Typography variant="h5" fontWeight={700} mb={3}>
        {keyword
          ? `Kết quả tìm kiếm cho "${keyword}"`
          : "Tất cả khoá học"}
      </Typography>
      <FilterDrawer />
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

      {/* ===== PAGINATION ===== */}
      {data && data.meta.pageTotals > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={data.meta.pageTotals}
            page={page + 1}
            onChange={handleChangePage}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
}
