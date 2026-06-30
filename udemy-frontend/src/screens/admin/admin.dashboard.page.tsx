import {
  Box,
  Card,
  Typography,
  Button,
  Grid,
  Paper,

  Chip,
  InputBase,
} from "@mui/material";


import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";

import { useGetAll, useGetById, useGetPaging } from "@/query/use.crud.query";
import { getDashBoard } from "@/query/user/user.query";
import {
  getByMonths,
  getCategoriesByDash,
} from "@/query/category/category.query";

import type { ICourseResponse } from "@/type/course.module";
import type {
  ICategoryCourseResponse,
  ICategoryStudentResponse,
} from "@/type/category.module";

import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import Loading from "@/components/loading";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
const COLORS = ["#534AB7", "#1D9E75", "#D85A30", "#BA7517", "#378ADD"];

export default function AdminDashBoardPage() {
  const theme = useTheme();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterStart, setFilterStart] = useState("");
  const [filterEnd, setFilterEnd] = useState("");

  const [selectedCategory, setSelectedCategory] =
  useState<{ id: string; name: string } | null>(null);

  // ===== DASHBOARD =====
  const { data, isLoading } = useGetPaging<ICourseResponse, any>(
    "dashboard/get-all",
    getDashBoard,
    { startDate: filterStart, endDate: filterEnd }
  );

  // ===== CATEGORY PIE =====
  const { data: cateData, isLoading: isLoadingCategories } =
    useGetAll<ICategoryCourseResponse[]>(
      "categories/get-all-no-page",
      getCategoriesByDash
    );

  // ===== CATEGORY MONTHS =====
  const { data: cateByMonths, } =
    useGetById<ICategoryStudentResponse[]>(
      "dashboard/monthly",
      getByMonths,
      selectedCategory?.id ?? "",
      !!selectedCategory
    );

  const handleFilter = () => {
    setFilterStart(startDate);
    setFilterEnd(endDate);
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    setFilterStart("");
    setFilterEnd("");
  };

  if (isLoading || isLoadingCategories) return <Loading />;

  // ===== BAR =====
  const barData =
    data?.elements?.map((c) => ({
      name: c.name.length > 12 ? c.name.slice(0, 12) + "..." : c.name,
      sold: c.sold,
    })) ?? [];

  // ===== SUMMARY =====
  const totalSold =
    data?.elements?.reduce((sum, c) => sum + c.sold, 0) ?? 0;
  const avgStar =
    data?.elements && data.elements.length > 0
      ? (
          data.elements.reduce((sum, c) => sum + c.star, 0) /
          data.elements.length
        ).toFixed(1)
      : "0";

  const totalHours =
    data?.elements?.reduce((sum, c) => sum + c.hour, 0).toFixed(1) ?? "0";

  // ===== PIE =====
  const totalCategory =
    cateData?.reduce((sum, c) => sum + c.courseCount, 0) ?? 0;

  const pieData =
    cateData?.map((c) => ({
      id: c.id,
      name: c.name,
      value: totalCategory
        ? Math.round((c.courseCount / totalCategory) * 100)
        : 0,
    })) ?? [];

  // ===== AREA DATA =====
  const areaData =
    cateByMonths?.map((m) => ({
      month: `T${m.month}`,
      students: m.students,
    })) ?? [];
const fmt = (d: string) => {
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
};
  return (
    <Box p={3}>
      <Typography variant="h5" mb={3} fontWeight="bold">
        Thống kê khóa học
      </Typography>

      {/* SUMMARY */}
      <Grid container spacing={2} mb={3}>
        {[
          {
            label: "Tổng học viên",
            value: new Intl.NumberFormat().format(totalSold),
          },
          { label: "Tổng khóa học", value: data?.elements?.length ?? 0 },
          { label: "Đánh giá TB", value: `${avgStar} ★` },
          { label: "Tổng giờ học", value: `${totalHours} giờ` },
        ].map((item) => (
          <Grid size={{ xs: 6, sm: 3 }} key={item.label}>
            <Box sx={{ background: theme.palette.action.hover, p: 2, borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {item.label}
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {item.value}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

{/* FILTER */}
<Box component={Paper} sx={{ p: "12px 20px", mb: 3, borderRadius: "12px" }}>
  <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
    
    <Box display="flex" alignItems="center" gap={0.75}>
      <CalendarMonthIcon sx={{ fontSize: 16, color: "text.disabled" }} />
      <Typography fontSize={13} color="text.disabled" whiteSpace="nowrap">
        Lọc theo ngày
      </Typography>
    </Box>

    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        border: "0.5px solid",
        borderColor: "divider",
        borderRadius: 1,
        overflow: "hidden",
        bgcolor: "action.hover",
      }}
    >
      <InputBase
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        inputProps={{ title: "Từ ngày" }}
        sx={{ px: 1.25, py: 0.875, fontSize: 13, minWidth: 130, "& input": { cursor: "pointer" } }}
      />
      <Box
        sx={{
          px: 1, py: 0.875,
          borderLeft: "0.5px solid", borderRight: "0.5px solid", borderColor: "divider",
          bgcolor: "background.default",
          display: "flex", alignItems: "center",
        }}
      >
        <ArrowRightAltIcon sx={{ fontSize: 16, color: "text.disabled" }} />
      </Box>
      <InputBase
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        inputProps={{ title: "Đến ngày" }}
        sx={{ px: 1.25, py: 0.875, fontSize: 13, minWidth: 130, "& input": { cursor: "pointer" } }}
      />
    </Box>

    <Button
      variant="contained"
      size="small"
      startIcon={<FilterListIcon sx={{ fontSize: 14 }} />}
      onClick={handleFilter}
      sx={{ fontSize: 13, textTransform: "none", borderRadius: 1 }}
    >
      Lọc
    </Button>

    {(filterStart || filterEnd) && (
      <Chip
        icon={<CalendarTodayIcon sx={{ fontSize: "13px !important" }} />}
        label={[filterStart && fmt(filterStart), filterEnd && fmt(filterEnd)].filter(Boolean).join(" – ")}
        onDelete={handleClear}
        deleteIcon={<CloseIcon />}
        size="small"
        color="primary"
        variant="outlined"
        sx={{ fontSize: 12, borderRadius: "999px" }}
      />
    )}

  </Box>
</Box>

      {/* CHARTS */}
      <Grid container spacing={3}>
        {/* BAR */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ p: 2 }}>
            <Typography mb={2}>Học viên theo khóa học</Typography>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RTooltip />
                <Bar dataKey="sold" fill={theme.palette.primary.main} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* PIE */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ p: 2 }}>
            <Typography mb={2}>Phân bố danh mục</Typography>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  onClick={(_, index) => {
                    const cate = pieData[index];
                    if (cate) {
                        setSelectedCategory({ id: cate.id, name: cate.name });
                    }
                    }}
                    style={{ outline: "none" }}  
                  label={({ name, value }) => `${name} ${value}%`}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <RTooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>

      {/* AREA */}
      <Card sx={{ p: 2, mt: 3 }}>
        <Typography mb={2}>
          {selectedCategory
            ? `Học viên theo tháng (${selectedCategory.name})`
            : "Chọn category để xem"}
        </Typography>

        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={areaData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <RTooltip />
            <Area
              dataKey="students"
              stroke="#534AB7"
              fill="#534AB7"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </Box>
  );
}