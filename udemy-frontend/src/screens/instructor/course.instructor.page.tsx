import {
  Box,
  Button,
  FormControlLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
  Tooltip,
  useTheme,
  IconButton
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGetPaging, useSave } from "@/query/use.crud.query";
import { disableCourseByIns, enableCourseByIns, getCoursesByAuthor } from "@/query/course/course.query";
import Loading from "@/components/loading";
import type { IMetaResponse } from "@/type/pagination";
import type { ICourseResponse } from "@/type/course.module";
import PaginationComponent from "@/components/admin/layout/pagination.component";
import { Chip } from "@mui/material";
import { getCourseStatusMap } from "@/constants/course.status";
import { motion, AnimatePresence } from "framer-motion";
import { listVariants, itemVariants } from "@/helpers/variants";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { showToast } from "@/utils/toast";
import type { AxiosError } from "axios";
import type { IApiResponse } from "@/type/api.response";
import { query } from "@/main";

export default function CourseInstructorPage() {

  const navigate = useNavigate();
  const theme = useTheme();
  const STATUS_MAP = getCourseStatusMap(theme);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"newest" | "oldest">("newest");
  const [active, setActive] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [meta, setMeta] = useState<IMetaResponse>({
    currentPage: 1,
    pageSize: 10,
    elementTotals: 0,
    pageTotals: 0,
  });
  const [courses, setCourses] = useState<ICourseResponse[] | null>(null);
  const { isLoading, data } = useGetPaging(
    "courses/get-all-by-author",
    getCoursesByAuthor,
    { page: page - 1, size: 5, active, keyword: search, filter }
  );
  const {mutateAsync:deleteCourse,isPending:isDeleted} = 
  useSave<boolean,string>('courses/delete',disableCourseByIns);
  const {mutateAsync:activateCourse,isPending:isActive} = useSave<boolean,string>('courses/activate',enableCourseByIns)
  useEffect(() => {
    if (data && !isLoading) {
      setCourses(data.elements);
      setMeta(data.meta);
    }
  }, [data, isLoading]);

  if (isLoading) return <Loading />;
  const isEmpty = (data?.elements.length ?? 0) === 0;

  return (
    <Box sx={{ p: 3 }}>
      {/* ===== TOP BAR ===== */}
      <Stack direction="row" spacing={2} alignItems="center" mb={3}>
        <TextField
          placeholder="Search your courses"
          size="small"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          sx={{ width: 260 }}
          InputProps={{ endAdornment: <SearchIcon fontSize="small" /> }}
        />

        <Select
          size="small"
          value={filter}
          onChange={(e) => {
            setPage(1);
            setFilter(e.target.value as any);
          }}
          sx={{ width: 120 }}
        >
          <MenuItem value="newest">Mới nhất</MenuItem>
          <MenuItem value="oldest">Cũ nhất</MenuItem>
        </Select>

        <FormControlLabel
          control={
            <Switch
              checked={active}
              onChange={(e) => {
                setPage(1);
                setActive(e.target.checked);
              }}
            />
          }
          label={active ? "Đã kích hoạt" : "Chưa kích hoạt"}
        />

        <Box flex={1} />

        <Button
          component={Link}
          to={"/instructor/create-course"}
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ bgcolor: "#6c2bd9", "&:hover": { bgcolor: "#5a22b5" } }}
        >
          Khoá học mới
        </Button>
      </Stack>

      {/* ===== COURSE LIST ===== */}
      <Stack spacing={2}>
        {isEmpty && (
          <Paper variant="outlined" sx={{ p: 3, borderColor: "error.main" }}>
            <Typography color="error">
              Danh sách khoá học rỗng
            </Typography>
          </Paper>
        )}

        {!isEmpty && (
          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {courses?.map((c) => (
                <motion.div
                  key={c.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                >
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 3,
                      borderColor: "#d8d8f0",
                      cursor: "pointer",
                      transition: "0.15s",
                      "&:hover": {
                        boxShadow: 3,
                        borderColor: "primary.main",
                      },
                    }}
                    onClick={() =>
                      navigate(`/instructor/edit-course/${c.id}`)
                    }
                  >
                    <Stack direction="row" spacing={3} alignItems="center">
                      <DescriptionOutlinedIcon sx={{ fontSize: 48, color: "#666" }} />

                      <Box flex={1}>
                        <Tooltip title={c.name} arrow placement="top">
                          <Typography
                            fontWeight={700}
                            sx={{
                              maxWidth: 300,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              cursor: "pointer",
                            }}
                          >
                            {c.name}
                          </Typography>
                        </Tooltip>

                        <Stack direction="row" spacing={1} mt={0.5}>
                          <Typography fontSize={12} fontWeight={700}>
                            số sao: {c.star}
                          </Typography>
                          <Typography fontSize={12} color="text.secondary">
                            đã bán: {c.sold}
                          </Typography>
                        </Stack>
                      </Box>

                      <Box sx={{ width: 300 }}>
                        <Typography fontSize={13} mb={0.5}>
                          Tổng thời lượng
                        </Typography>
                        <Typography fontWeight={700}>
                          {c.hour} giờ
                        </Typography>
                      </Box>

                      {/* STATUS */}
                      <Box minWidth={120} textAlign="right">
                        <Chip
                          label={STATUS_MAP[c.status].label}
                          sx={{
                            backgroundColor: "#fff",
                            border: `1px solid ${STATUS_MAP[c.status].borderColor}`,
                            color: STATUS_MAP[c.status].textColor,
                            borderRadius: "6px",
                            fontWeight: 700,
                          }}
                        />
                      </Box>
                      {/* ACTION */}
                      <Box minWidth={80} textAlign="right">
                        {active ? (
                          <Tooltip title="Ẩn khoá học">
                            <IconButton
                              size="small"
                              disabled={isDeleted}
                              onClick={async (e) => {
                                e.stopPropagation();
                                try{
                                  await deleteCourse(c.id);
                                  query.invalidateQueries({queryKey:["courses/get-all-by-author"]})
                                }catch(err){
                                  const axiosErr = err as AxiosError<IApiResponse<string>>;
                                  showToast(axiosErr.response?.data.message||"error occurr");
                                }
                              }}
                            >
                              <VisibilityOffOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Hiện khoá học">
                            <IconButton
                              size="small"
                              disabled={isActive}
                              onClick={async (e) => {
                                e.stopPropagation();
                                try{
                                  await activateCourse(c.id);
                                  query.invalidateQueries({queryKey:["courses/get-all-by-author"]})
                                }catch(err){
                                  const axiosErr = err as AxiosError<IApiResponse<string>>;
                                  showToast(axiosErr.response?.data.message||"error occurr")
                                }
                              }}
                            >
                              <VisibilityOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>

                    </Stack>
                  </Paper>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!isEmpty && (
          <PaginationComponent
            meta={meta}
            page={page}
            setPage={setPage}
            isLoading={isLoading}
          />
        )}
      </Stack>

    </Box>
  );
}
