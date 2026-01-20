import { Alert, Box, Chip, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import ManagementHeader from "../../components/admin/layout/management.header";
import { useFetchHook } from "../../hooks/admin/fetch.hook";
import type { ICategoryResponse } from "../../type/category.module";
import { activateCategory, disableCategory, getAllCategories } from "../../redux/thunks/admin/category.thunk";
import { useActionHook } from "../../hooks/admin/action.hook";
import { useState } from "react";
import Loading from "../../components/loading";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";
import PaginationComponent from "../../components/admin/layout/pagination.component";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CategoryCreateDialog from "../../components/admin/category/category.create.dialog";
import CategoryUpdateDialog from "../../components/admin/category/category.update.dialog";

export default function CategoryManagementPage() {
 // fetch hook
   const {data,page,active,handleToggle,keyword,setKeyword
     ,loading,error,setPage,meta,fetchData
   } = useFetchHook<ICategoryResponse>({errorName:"categories/getAll",thunkMethod:getAllCategories});
   // action hook
   const {handleDisable,handleEnable} = 
   useActionHook<boolean>({errorNameDisable:"categories/disable",errorNameEnable:"categories/activate",
     thunkMethodDisable:disableCategory,thunkMethodEnable:activateCategory});
   const [selectedDataId, setSelectedDataId] = useState<string>("");
   const [openCreate,setOpenCreate] = useState<boolean>(false);
   const [openUpdate,setOpenUpdate] = useState<boolean>(false);
  return (
    <Box>
      {/* ===== Header ===== */}
      <ManagementHeader title={"Quản lí danh mục"} active={active} handleToggle={handleToggle} setOpenCreate={setOpenCreate}
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
                      <TableCell sx={{ fontWeight: 700 }}>Tên</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Danh mục cha</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>
                        Hành vi
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((c) => (
                      <TableRow
                        key={c.id}
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
                          <Tooltip title={c.id}>
                            <Typography fontFamily="monospace">
                              {c.id.slice(0, 8)}...
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          {c.name || (
                            <Typography color="text.disabled">—</Typography>
                          )}
                        </TableCell>
                        {/* Parent */}
                        <TableCell>
                          <Chip
                            label={c.categoryParent?.name}
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
                                  setSelectedDataId(c.id);
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
                                  onClick={async () => {
                                    await handleDisable(c.id)
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
                                    await handleEnable(c.id)
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
      <CategoryCreateDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
      />
      <CategoryUpdateDialog
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        categoryId={selectedDataId}
        setCategoryId={setSelectedDataId}
      />
    </Box>
  );
}
