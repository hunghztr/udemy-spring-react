import ManagementHeader from "@/components/admin/layout/management.header";
import Loading from "@/components/loading";
import { useFetchHook } from "@/hooks/admin/fetch.hook";
import { getAllCoursesByAdmin } from "@/query/course/course.query";
import type { ICourseResponse } from "@/type/course.module";
import { Box, Typography, Paper, Stack, Alert, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Tooltip } from "@mui/material";

import PaginationComponent from "@/components/admin/layout/pagination.component";
export default function CourseManagementPage() {
  const {data,page,active,handleToggle,keyword,setKeyword
      ,isLoading,setPage,meta
    } = useFetchHook<ICourseResponse>({fetchMethod:getAllCoursesByAdmin,queryName:"courses/fetch-all"});
    // action hook
      
  return (
    <Box>
      <ManagementHeader title={"Quản lí khoá học"} active={active} handleToggle={handleToggle}
            keyword={keyword} setKeyword={setKeyword} />

      {/* ===== Table ===== */}
      <Paper sx={{ p: 2, minHeight: 240 }}>
        {/* ⏳ Loading */}
        {isLoading && (
          <Stack alignItems="center" py={4}>
            <Loading />
          </Stack>
        )}
        {/* ❌ Error */}
        {data?.length === 0 && (
          <Alert severity="error">Danh sách khoá học rỗng</Alert>
        )}
        {/* ✅ Data */}
        {!isLoading &&
          data &&
          data.length > 0 && (
            <>
              <TableContainer
                component={Paper}
                sx={{
                  borderRadius: 2,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                }}
              >
                
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#fafafa" }}>
                      <TableCell sx={{ fontWeight: 700 }}>Mã</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>
                        Tiêu đề
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Đánh giá</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Lượt bán</TableCell>                     
                      <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>                     
               
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((course) => (
                      <TableRow
                        onClick={() =>
                          window.open(`/instructor/edit-course/${course.id}`, "_blank")
                        }
                        // onClick={() => navigate(`/instructor/edit-course/${course.id}`)}
                        key={course.id}
                        hover
                        sx={{
                          cursor: "pointer",
                          transition: "0.2s",
                          "&:hover": {
                            backgroundColor: "rgba(25,118,210,0.06)",
                          },
                        }}
                      >
                        {/* ID rút gọn */}
                        <TableCell>
                          <Tooltip title={course.id}>
                            <Typography fontFamily="monospace">
                              {course.id.slice(0, 8)}...
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={course.name}>
                            <Typography fontFamily="monospace">
                              {course.name.length > 20
                                ? `${course.name.slice(0, 20)}...`
                                : course.name}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          {course.star}
                        </TableCell>
                        <TableCell>
                          {course.sold}
                        </TableCell>
                        <TableCell>
                          {course.status}
                        </TableCell>       
                       
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
          <PaginationComponent
                meta={meta}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
              />
      </Paper>
    </Box>
  );
}
