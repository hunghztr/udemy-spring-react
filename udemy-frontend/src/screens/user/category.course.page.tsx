import PaginationComponent from "@/components/admin/layout/pagination.component";
import CourseCard from "@/components/user/course/card/course.card";
import SkeletonCard from "@/components/user/course/card/skeleton.card";
import CourseSort from "@/components/user/course/course.sort";
import FilterDrawer from "@/components/user/course/filter.drawer";
import {  formatCategoryName, getCategorySlug } from "@/helpers/slugify";
import { getCoursesByCategory } from "@/query/category/category.query";
import type { IFilterRequest } from "@/type/course.module";
import type { IMetaResponse } from "@/type/pagination";
import {
  Box,
  Container,
  Typography,
  Grid,
  Stack,
  Chip,
  Divider,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

export default function CategoryCoursePage() {
  const { slug } = useParams();
  const categoryId = useMemo(() => {
      if (!slug) return null;
      const match = slug.match(/([0-9a-fA-F-]{36})\.html$/);
      return match ? match[1] : null;
    }, [slug]);
    const rawSlug = getCategorySlug(slug);
    const categoryName = formatCategoryName(rawSlug);

  const [page, setPage] = useState<number>(1);
  const [filters, setFilters] = useState<IFilterRequest|undefined>(undefined);
  const { data, isLoading } = getCoursesByCategory({
    id: categoryId || "",
    data: { page: page - 1, size: 12 },
    filters
  });
  const meta = data?.meta;
  return (
    <Box>
        {/* HERO */}
        <Box
          sx={{
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.dark}, #1c1d1f)`,
            color: "white",
            py: { xs: 6, md: 8 },
            mb: 4
          }}
        >
          <Container maxWidth="lg">
            <Stack spacing={3} maxWidth={800}>

              {/* breadcrumb */}
              <Typography
                variant="body2"
                sx={{ opacity: 0.75 }}
              >
                Danh mục khóa học / <b>{categoryName}</b>
              </Typography>

              {/* title */}
              <Typography
                variant="h2"
                fontWeight={800}
                sx={{
                  lineHeight: 1.2,
                  letterSpacing: -0.5
                }}
              >
                {categoryName}
              </Typography>

              {/* description */}
              <Typography
                variant="body1"
                sx={{
                  opacity: 0.85,
                  maxWidth: 600
                }}
              >
                Khám phá các khóa học chất lượng trong lĩnh vực{" "}
                <b>{categoryName}</b>. Học từ các giảng viên hàng đầu
                và nâng cao kỹ năng của bạn.
              </Typography>

              {/* meta */}
              <Stack direction="row" spacing={2} flexWrap="wrap">

                <Chip
                  label={`${meta?.elementTotals ?? 0} khóa học`}
                  color="primary"
                  sx={{
                    fontWeight: 600
                  }}
                />

                <Chip
                  label="Cập nhật liên tục"
                  variant="outlined"
                  sx={{
                    color: "white",
                    borderColor: "rgba(255,255,255,0.4)"
                  }}
                />

              </Stack>

            </Stack>
          </Container>
        </Box>

      {/* CONTENT */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>

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
        <Divider sx={{ mb: 3 }} />

        {/* LOADING */}
        {isLoading && (
          <Grid container spacing={3}>
            {Array.from(new Array(8)).map((_, index) => (
              <Grid sx={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
                <SkeletonCard />
              </Grid>
            ))}
          </Grid>
        )}

        {/* COURSE GRID */}
        {!isLoading && (
          <Grid container spacing={3}>
            {data?.elements.map((course) => (
              <Grid sx={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={course.id}>
                <CourseCard course={course} />
              </Grid>
            ))}
          </Grid>
        )}
        {!isLoading && (
                      <PaginationComponent
                        meta={meta||{} as IMetaResponse}
                        page={page}
                        setPage={setPage}
                        isLoading={isLoading}
                      />
                    )}
      </Container>
      <Divider sx={{ my: "10px",mx: "10px" }} />
    </Box>
  );
}