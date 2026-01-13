import {Box,Typography,Paper,Alert,Stack,Table,
  TableHead,TableRow,TableCell,TableBody,TableContainer,
  Tooltip,Chip,IconButton,} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PaginationComponent from "../../components/admin/layout/pagination.component";
import Loading from "../../components/loading";

import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";
import UserCreateDialog from "../../components/admin/user/user.create.dialog";
import UserUpdateDialog from "../../components/admin/user/user.update.dialog";
import UserHeader from "../../components/admin/layout/management.header";
import { useFetchHook } from "../../hooks/admin/fetch.hook";
import { useState } from "react";
import type { IUserResponse } from "../../type/user.module";
import { useActionHook } from "../../hooks/admin/action.hook";
import { activateUser, disableUser, getAllUsers } from "../../redux/thunks/admin/user.thunk";

export default function UserManagement() {
  // fetch hook
  const {data,page,active,handleToggle,keyword,setKeyword
    ,loading,error,setPage,meta,fetchData
  } = useFetchHook<IUserResponse>({errorName:"users/getAll",thunkMethod:getAllUsers});

  // action hook
  const {handleDisable,handleEnable} = 
  useActionHook<boolean>({errorNameDisable:"users/disable",errorNameEnable:"users/activate",
    thunkMethodDisable:disableUser,thunkMethodEnable:activateUser});
  const [selectedDataId, setSelectedDataId] = useState<string>("");
  const [openCreate,setOpenCreate] = useState<boolean>(false);
  const [openUpdate,setOpenUpdate] = useState<boolean>(false);
  return (
    <Box>
      {/* ===== Header ===== */}
      <UserHeader active={active} handleToggle={handleToggle} setOpenCreate={setOpenCreate}
      keyword={keyword} setKeyword={setKeyword} />

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
                                  disabled={user.roleName === "ADMIN"}
                                  onClick={async () => {
                                    await handleDisable(user.id)
                                    fetchData();
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
                                  onClick={async () => {
                                    await handleEnable(user.id)
                                    fetchData();
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
                pendingCount={loading.pendingCount}
              />
      </Paper>
      {/* ===== Dialogs ===== */}
      <UserCreateDialog
        fetchData={fetchData}
        open={openCreate}
        onClose={() => setOpenCreate(false)}
      />
      <UserUpdateDialog
        fetchData={fetchData}
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        userId={selectedDataId}
        setUserId={setSelectedDataId}
      />
    </Box>
  );
}
