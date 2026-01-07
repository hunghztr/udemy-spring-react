import {
  Box,
  Typography,
  Paper,
  Alert,
  Stack,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Tooltip,
  Chip,
  IconButton,
  Button,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PaginationComponent from "../../components/pagination.component";
import { useUserHook } from "../../hooks/admin/user.hook";
import Loading from "../../components/loading";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";
import UserCreateDialog from "../../components/user/admin/user.create.dialog";
import UserUpdateDialog from "../../components/user/admin/user.update.dialog";
import { useEffect, useState } from "react";
import { useSaveUserHook } from "../../hooks/admin/save.user.hook";

export default function UserManagement() {
  const {
    loading,
    error,
    users,
    meta,
    page,
    setPage,
    openCreate,
    setOpenCreate,
    openUpdate,
    setOpenUpdate,
    setRefreshFlag,
    active,
    handleToggle
  } = useUserHook();

  const { handleDisableUser, success, setSuccess,handleEnableUser } = useSaveUserHook();
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  useEffect(() => {
    if (success) {
      setRefreshFlag(true);
      setSuccess(false);
    }
  }, [success]);
  return (
    <Box>
      {/* ===== Header ===== */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5" fontWeight="bold">
          Quản lý người dùng
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          <ToggleButtonGroup
            size="small"
            value={active}
            exclusive
            onChange={handleToggle}
          >
            <ToggleButton value={true}>Đang hoạt động</ToggleButton>
            <ToggleButton value={false} color="warning">
              Ngừng hoạt động
            </ToggleButton>
          </ToggleButtonGroup>

          {/* ➕ Add */}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenCreate(true)}
          >
            Thêm mới
          </Button>
        </Stack>
      </Stack>

      {/* ===== Table ===== */}
      <Paper sx={{ p: 2, minHeight: 240 }}>
        {/* ⏳ Loading */}
        {loading.pendingCount > 0 && (
          <Stack alignItems="center" py={4}>
            <Loading />
          </Stack>
        )}

        {/* ❌ Error */}
        {loading.pendingCount === 0 && error && (
          <Alert severity="error">{error}</Alert>
        )}

        {/* ✅ Data */}
        {loading.pendingCount === 0 &&
          !error &&
          users &&
          users.length > 0 && (
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
                    {users.map((user) => (
                      <TableRow
                        key={user.id}
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
                            {/* ✏️ Edit */}
                            <Tooltip title="Sửa thông tin">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => {
                                  setSelectedUserId(user.id);
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
                                  disabled={user.roleName === "ADMIN"}
                                  onClick={() => handleDisableUser(user.id)}
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
                                  onClick={() => handleEnableUser(user.id)}
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

              <PaginationComponent
                meta={meta}
                page={page}
                setPage={setPage}
                pendingCount={loading.pendingCount}
              />
            </>
          )}
      </Paper>

      {/* ===== Dialogs ===== */}
      <UserCreateDialog
        setRefreshFlag={setRefreshFlag}
        open={openCreate}
        onClose={() => setOpenCreate(false)}
      />

      <UserUpdateDialog
        setRefreshFlag={setRefreshFlag}
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        userId={selectedUserId}
        setUserId={setSelectedUserId}
      />
    </Box>
  );
}
