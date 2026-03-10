import { Alert, Box, Chip, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useFetchHook } from "@/hooks/admin/fetch.hook";
import type { ICategoryResponse } from "@/type/category.module";
import { useActionHook } from "@/hooks/admin/action.hook";
import ManagementHeader from "@/components/admin/layout/management.header";
import Loading from "@/components/loading";
import PaginationComponent from "@/components/admin/layout/pagination.component";
import CategoryCreateDialog from "@/components/admin/category/category.create.dialog";
import CategoryUpdateDialog from "@/components/admin/category/category.update.dialog";
import { disableCategory, enableCategory, getAllCategories } from "@/query/category/category.query";
import { query } from "@/main";


export default function CategoryManagementPage() {
 // fetch hook
   const {data,page,active,handleToggle,keyword,setKeyword
     ,isLoading,setPage,meta
   } = useFetchHook<ICategoryResponse>({fetchMethod:getAllCategories,queryName:"categories/fetch-all"});
   // action hook
   const {handleDisable,handleEnable} = 
   useActionHook({mutationDisable:"users/disable",mutationEnable:"categories/enable",
     disableMethod:disableCategory,enableMethod:enableCategory
   });
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
        {isLoading && (
          <Stack alignItems="center" py={4}>
            <Loading />
          </Stack>
        )}
        {/* ❌ Error */}
        {data?.length === 0 && (
          <Alert severity="error">Danh sách danh mục rỗng</Alert>
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
                                    query.invalidateQueries({queryKey:["categories/fetch-all"]})
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
                                    query.invalidateQueries({queryKey:["categories/fetch-all"]})
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
