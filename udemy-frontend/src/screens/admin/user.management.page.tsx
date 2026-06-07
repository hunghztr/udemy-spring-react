import {Box,Typography,Paper,Alert,Stack,Table,
  TableHead,TableRow,TableCell,TableBody,TableContainer,
  Tooltip,Chip,IconButton,} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@mui/material";
import { useState } from "react";
import { useFetchHook } from "@/hooks/admin/fetch.hook";
import type { IUserResponse } from "@/type/user.module";
import ManagementHeader from "@/components/admin/layout/management.header";
import Loading from "@/components/loading";
import PaginationComponent from "@/components/admin/layout/pagination.component";
import UserCreateDialog from "@/components/admin/user/user.create.dialog";
import UserUpdateDialog from "@/components/admin/user/user.update.dialog";
import { disableUser, enableUser, getAllUsers } from "@/query/user/user.query";
import { useActionHook } from "@/hooks/admin/action.hook";
import { type ICourseResponse } from "@/type/course.module";
import type { IApiResponse } from "@/type/api.response";
import api from "@/api/api";
import { query } from "@/query/queryClient";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import InstructorRevenueDialog from "@/components/admin/user/revenue.dialog";


export default function UserManagement() {
  // state revenue dialog
const [openRevenue, setOpenRevenue] = useState(false);
const [selectedInstructorId, setSelectedInstructorId] = useState("");
  // fetch hook
  const {data,page,active,handleToggle,keyword,setKeyword
    ,isLoading,setPage,meta
  } = useFetchHook<IUserResponse>({fetchMethod:getAllUsers,queryName:"users/fetch-all"});
  // action hook
  const {handleDisable,handleEnable,isPendingDisable,isPendingEnable} = 
  useActionHook({mutationDisable:"users/disable",mutationEnable:"users/enable",
    disableMethod:disableUser,enableMethod:enableUser
  });
  const [selectedDataId, setSelectedDataId] = useState<string>("");
  const [openCreate,setOpenCreate] = useState<boolean>(false);
  const [openUpdate,setOpenUpdate] = useState<boolean>(false);
  const [openCourses,setOpenCourses] = useState(false);

  const [courses,setCourses] = useState<ICourseResponse[]|undefined>(undefined)
  const handleClick = async (username: string) =>{
    const res : IApiResponse<ICourseResponse[]> =
      await api.get(`/admin/users/get-bought-courses/${username}`);

    setCourses(res.data);
    setOpenCourses(true);
  }
  return (
    <Box>
      {/* ===== Header ===== */}
      <ManagementHeader title={"Quản lí người dùng"} active={active} handleToggle={handleToggle} setOpenCreate={setOpenCreate}
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
          <Alert severity="error">Danh sách người dùng rỗng</Alert>
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
                    <TableRow sx={{ backgroundColor: "grey.50" }}>
                      <TableCell sx={{ fontWeight: 700 }}>Mã</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>
                        Tài khoản
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Họ tên</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Vai trò</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>
                        Hành vi
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((user) => (
                      <TableRow
                        key={user.id}
                        onClick={() => handleClick(user.username)}
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
                          <Tooltip title={user.id}>
                            <Typography fontFamily="monospace">
                              {user.id.slice(0, 8)}...
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>
                          {user.fullname || (
                            <Typography color="text.disabled">—</Typography>
                          )}
                        </TableCell>
                        {/* Role */}
                        <TableCell>
                          <Chip
                            label={user.roleName}
                            color={
                              user.roleName === "ADMIN" ? "error" : "primary"
                            }
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                        {/* Action */}
                        <TableCell align="center">
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="center"
                          >
                            {user.roleName === "INSTRUCTOR" && (
                              <Tooltip title="Xem doanh thu">
                                <IconButton
                                  size="small"
                                  color="success"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedInstructorId(user.id);
                                    setOpenRevenue(true);
                                  }}
                                >
                                  <AttachMoneyIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                            {/* ✏️ Edit */}
                            <Tooltip title="Sửa thông tin">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedDataId(user.id);
                                  setOpenUpdate(true);
                                }}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            {/* 🚫 Disable khi đang Active */}
                            {active && (
                              <Tooltip title="Ngừng hoạt động">
                                <IconButton
                                  size="small"
                                  color="warning"
                                  disabled={user.roleName === "ADMIN" || isPendingDisable}
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    await handleDisable(user.id)
                                    
                                    query.invalidateQueries({queryKey:["users/fetch-all"]})
                                  }}
                                >
                                  <BlockIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                            {/* ✅ Enable khi đang Inactive */}
                            {!active && (
                              <Tooltip title="Kích hoạt lại">
                                <IconButton
                                  size="small"
                                  color="success"
                                  disabled={isPendingEnable}
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    await handleEnable(user.id)
                                    query.invalidateQueries({queryKey:["users/fetch-all"]})
                                  }}
                                >
                                  <CheckCircleIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Stack>
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
      {/* ===== Dialogs ===== */}
      <UserCreateDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
      />
      <UserUpdateDialog
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        userId={selectedDataId}
        setUserId={setSelectedDataId}
      />
      <Dialog
      open={openCourses}
      onClose={()=>setOpenCourses(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Khoá học đã mua</DialogTitle>

      <DialogContent>

        {!courses || courses.length === 0 && (
          <Alert severity="info">
            Người dùng chưa mua khoá học nào
          </Alert>
        )}

        {courses && courses.length > 0 && (
          <TableContainer component={Paper}>
            <Table size="small">

              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Tên khoá học</TableCell>
                  <TableCell>Đánh giá</TableCell>
                  <TableCell>Đã bán</TableCell>
                  <TableCell>Thời lượng</TableCell>
                  <TableCell>Trạng thái</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {courses.map(course=>(
                  <TableRow key={course.id}>
                    <TableCell>
                      {course.id.slice(0,8)}...
                    </TableCell>

                    <TableCell>{course.name}</TableCell>

                    <TableCell>{course.star}</TableCell>

                    <TableCell>{course.sold}</TableCell>

                    <TableCell>{course.hour}h</TableCell>

                    <TableCell>
                      <Chip
                        label={course.status}
                        color={
                          course.status === "PUBLISHED"
                            ? "success"
                            : course.status === "PENDING"
                            ? "warning"
                            : "error"
                        }
                        size="small"
                      />
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>

            </Table>
          </TableContainer>
        )}

      </DialogContent>

      <DialogActions>
        <Button onClick={()=>setOpenCourses(false)}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
    <InstructorRevenueDialog
      open={openRevenue}
      onClose={() => {
        setOpenRevenue(false);
        setSelectedInstructorId("");
      }}
      instructorId={selectedInstructorId}
    />
    </Box>
  );
}
