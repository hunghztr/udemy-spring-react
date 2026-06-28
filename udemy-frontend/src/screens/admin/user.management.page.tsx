import {Box,Typography,Paper,Alert,Stack,Table,
  TableHead,TableRow,TableCell,TableBody,TableContainer,
  Chip,IconButton,
  Tooltip,} from "@mui/material";
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
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";

export default function UserManagement() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuUser, setMenuUser] = useState<IUserResponse | null>(null);

  const [openRevenue, setOpenRevenue] = useState(false);
  const [selectedInstructorId, setSelectedInstructorId] = useState("");

  const {data,page,active,handleToggle,keyword,setKeyword,isLoading,setPage,meta} =
    useFetchHook<IUserResponse>({fetchMethod:getAllUsers,queryName:"users/fetch-all"});

  const {handleDisable,handleEnable,isPendingDisable,isPendingEnable} =
    useActionHook({mutationDisable:"users/disable",mutationEnable:"users/enable",
      disableMethod:disableUser,enableMethod:enableUser
    });

  const [selectedDataId, setSelectedDataId] = useState<string>("");
  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const [openCourses, setOpenCourses] = useState(false);
  const [courses, setCourses] = useState<ICourseResponse[] | undefined>(undefined);

  const handleClick = async (username: string) => {
    const res: IApiResponse<ICourseResponse[]> =
      await api.get(`/admin/users/get-bought-courses/${username}`);
    setCourses(res.data);
    setOpenCourses(true);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuUser(null);
  };

  return (
    <Box>
      <ManagementHeader title={"Quản lý người dùng"} active={active} handleToggle={handleToggle}
        setOpenCreate={setOpenCreate} keyword={keyword} setKeyword={setKeyword} />

      <Paper sx={{ p: 2, minHeight: 240 }}>
        {isLoading && (
          <Stack alignItems="center" py={4}>
            <Loading />
          </Stack>
        )}

        {data?.length === 0 && (
          <Alert severity="error">Danh sách người dùng rỗng</Alert>
        )}

        {!isLoading && data && data.length > 0 && (
          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "grey.50" }}>
                  <TableCell sx={{ fontWeight: 700 }}>Mã</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Tài khoản</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Họ tên</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Vai trò</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Hành vi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((user) => (
                  <TableRow
                    key={user.id}
                    hover
                    sx={{
                      transition: "0.2s",
                      "&:hover": { backgroundColor: "rgba(25,118,210,0.06)" },
                    }}
                  >
                  <TableCell>
                    <Tooltip title={user.id}>
                      <Typography fontFamily="monospace">
                        {user.id.slice(0, 8)}...
                      </Typography>
                    </Tooltip>
                  </TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>
                      {user.fullname || <Typography color="text.disabled">—</Typography>}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.roleName}
                        color={user.roleName === "ADMIN" ? "error" : "primary"}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAnchorEl(e.currentTarget);
                          setMenuUser(user);
                        }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <PaginationComponent meta={meta} page={page} setPage={setPage} isLoading={isLoading} />
      </Paper>

      {/* ===== Dropdown Menu ===== */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={() => { handleCloseMenu(); handleClick(menuUser?.username ?? ""); }}>
          <ListItemIcon><ShoppingBagIcon fontSize="small" color="primary" /></ListItemIcon>
          <ListItemText>Khoá học đã mua</ListItemText>
        </MenuItem>

        {menuUser?.roleName === "INSTRUCTOR" && (
          <MenuItem onClick={() => { handleCloseMenu(); setSelectedInstructorId(menuUser.id); setOpenRevenue(true); }}>
            <ListItemIcon><AttachMoneyIcon fontSize="small" color="success" /></ListItemIcon>
            <ListItemText>Xem doanh thu</ListItemText>
          </MenuItem>
        )}

        <MenuItem onClick={() => { handleCloseMenu(); setSelectedDataId(menuUser?.id ?? ""); setOpenUpdate(true); }}>
          <ListItemIcon><EditIcon fontSize="small" color="primary" /></ListItemIcon>
          <ListItemText>Sửa thông tin</ListItemText>
        </MenuItem>

        {active ? (
          <MenuItem
            disabled={menuUser?.roleName === "ADMIN" || isPendingDisable}
            onClick={async () => {
              handleCloseMenu();
              await handleDisable(menuUser?.id ?? "");
              query.invalidateQueries({ queryKey: ["users/fetch-all"] });
            }}
          >
            <ListItemIcon><BlockIcon fontSize="small" color="warning" /></ListItemIcon>
            <ListItemText>Ngừng hoạt động</ListItemText>
          </MenuItem>
        ) : (
          <MenuItem
            disabled={isPendingEnable}
            onClick={async () => {
              handleCloseMenu();
              await handleEnable(menuUser?.id ?? "");
              query.invalidateQueries({ queryKey: ["users/fetch-all"] });
            }}
          >
            <ListItemIcon><CheckCircleIcon fontSize="small" color="success" /></ListItemIcon>
            <ListItemText>Kích hoạt lại</ListItemText>
          </MenuItem>
        )}
      </Menu>

      {/* ===== Dialogs ===== */}
      <UserCreateDialog open={openCreate} onClose={() => setOpenCreate(false)} />
      <UserUpdateDialog open={openUpdate} onClose={() => setOpenUpdate(false)}
        userId={selectedDataId} setUserId={setSelectedDataId} />

      <Dialog open={openCourses} onClose={() => setOpenCourses(false)} maxWidth="md" fullWidth>
        <DialogTitle>Khoá học đã mua</DialogTitle>
        <DialogContent>
          {(!courses || courses.length === 0) && (
            <Alert severity="info">Người dùng chưa mua khoá học nào</Alert>
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
                  {courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>{course.id.slice(0, 8)}...</TableCell>
                      <TableCell>{course.name}</TableCell>
                      <TableCell>{course.star}</TableCell>
                      <TableCell>{course.sold}</TableCell>
                      <TableCell>{course.hour}h</TableCell>
                      <TableCell>
                        <Chip
                          label={course.status}
                          color={
                            course.status === "PUBLISHED" ? "success"
                            : course.status === "PENDING" ? "warning"
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
          <Button onClick={() => setOpenCourses(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      <InstructorRevenueDialog
        open={openRevenue}
        onClose={() => { setOpenRevenue(false); setSelectedInstructorId(""); }}
        instructorId={selectedInstructorId}
      />
    </Box>
  );
}